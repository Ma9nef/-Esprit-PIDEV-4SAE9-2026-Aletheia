import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaceDetectionService, FaceDetectionResult } from '../service/face-detection.service';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.html',
  styleUrls: ['./video-room.css'],
  imports: [CommonModule, FormsModule]
})
export class VideoRoom implements OnInit, OnDestroy {

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  // Propriétés WebRTC
  peers: { [key: string]: RTCPeerConnection } = {};
  localStream!: MediaStream;
  ws!: WebSocket;
  wsId!: string;
  username!: string;
  
  peerNames: { [key: string]: string } = {};
  processingOffers: { [key: string]: boolean } = {};
  
  // Propriétés UI
  peerCount: number = 0;
  microEnabled: boolean = true;
  cameraEnabled: boolean = true;
  screenSharing: boolean = false;
  showChat: boolean = false;
  showParticipants: boolean = false;
  
  // Chat
  messages: Array<{sender: string, text: string, time: string, isOwn: boolean}> = [];
  newMessage: string = '';
  
  // Participants
  participants: Array<{id: string, name: string, isSpeaking: boolean, audioMuted: boolean, videoMuted: boolean}> = [];
  
  // Audio detection
  private audioContexts: Map<string, AudioContext> = new Map();
  private animationFrames: Map<string, number> = new Map();
  speakingUsers: Set<string> = new Set();

  // Face Detection
  faceDetectionEnabled: boolean = false;
  currentFaceDetection: FaceDetectionResult | null = null;
  faceDetectionHistory: FaceDetectionResult[] = [];
  faceDetectionInterval: any;
  mlServiceAvailable: boolean = true;

  private removingPeers: Set<string> = new Set();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private faceDetectionService: FaceDetectionService
  ) {}

  async ngOnInit() {
    const coursId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');
    this.username = localStorage.getItem('username') || 'Moi';

    console.log('🚀 Initialisation avec username:', this.username);

    this.ws = new WebSocket(`ws://localhost:8090/room/${coursId}?token=${token}`);

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: true 
      });
      console.log('📹 Stream local obtenu');
      
      this.addVideo(this.localStream, this.username, true, 'local');
      
      this.participants.push({
        id: 'local',
        name: `${this.username} (Moi)`,
        isSpeaking: false,
        audioMuted: false,
        videoMuted: false
      });
    } catch (error) {
      console.error('❌ Erreur accès caméra:', error);
      alert('Impossible d\'accéder à la caméra/microphone');
    }

    this.setupWebSocket();
    this.setupAudioDetection();
    await this.checkMLService();
  }

  setupWebSocket() {
    this.ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📩 Message reçu:', data);

        if (data.type === 'your-id') {
          this.wsId = data.id;
          console.log('🆔 Mon ID reçu du serveur:', this.wsId);
          
          // Mettre à jour l'ID de la vidéo locale
          setTimeout(() => {
            this.updateLocalVideoId(this.wsId);
          }, 500);
          return;
        }

        switch (data.type) {
          case 'chat':
            const isOwn = data.from === this.wsId;
            this.messages.push({
              sender: data.name,
              text: data.message,
              time: new Date().toLocaleTimeString(),
              isOwn: isOwn
            });
            this.scrollChatToBottom();
            break;

          case 'existing-user':
          case 'new-user':
            console.log(`👥 ${data.type}:`, data.name, data.id);
            this.peerNames[data.id] = data.name;
            this.participants.push({
              id: data.id,
              name: data.name,
              isSpeaking: false,
              audioMuted: false,
              videoMuted: false
            });
            
            if (data.id !== this.wsId && !this.peers[data.id] && !this.processingOffers[data.id]) {
              console.log(`🔄 Création peer pour ${data.name}`);
              this.processingOffers[data.id] = true;
              setTimeout(() => {
                this.createPeerAndSendOffer(data.id, data.name);
              }, 1000);
            }
            break;

          case 'offer':
            if (data.from === this.wsId) return;
            this.peerNames[data.from] = data.name;
            
            if (!this.peers[data.from]) {
              const pc = this.createPeerConnection(data.from, data.name);
              this.peers[data.from] = pc;
              this.updatePeerCount();
            }
            
            try {
              await this.peers[data.from].setRemoteDescription(new RTCSessionDescription(data.offer));
              const answer = await this.peers[data.from].createAnswer();
              await this.peers[data.from].setLocalDescription(answer);
              
              this.ws.send(JSON.stringify({
                type: 'answer',
                target: data.from,
                answer: answer,
                name: this.username
              }));
            } catch (err) {
              console.error('❌ Erreur traitement offre:', err);
            }
            break;

          case 'answer':
            if (data.from === this.wsId) return;
            this.peerNames[data.from] = data.name;
            
            if (this.peers[data.from]) {
              try {
                await this.peers[data.from].setRemoteDescription(new RTCSessionDescription(data.answer));
              } catch (err) {
                console.error('❌ Erreur traitement answer:', err);
              }
            }
            break;

          case 'ice-candidate':
            if (data.from !== this.wsId && this.peers[data.from]) {
              try {
                await this.peers[data.from].addIceCandidate(new RTCIceCandidate(data.candidate));
              } catch (err) {
                console.error('❌ Erreur ajout candidat ICE:', err);
              }
            }
            break;

          case 'user-left':
            console.log(`👋 Utilisateur parti: ${data.name} (${data.id})`);
            this.participants = this.participants.filter(p => p.id !== data.id);
            this.ngZone.run(() => {
              this.removeUserVideo(data.id);
            });
            
            if (this.peers[data.id]) {
              const pc = this.peers[data.id];
              pc.close();
              delete this.peers[data.id];
            }
            
            delete this.peerNames[data.id];
            this.updatePeerCount();
            break;

          case 'audio-mute':
            this.updateParticipantMute(data.id, 'audio', data.muted);
            break;

          case 'video-mute':
            this.updateParticipantMute(data.id, 'video', data.muted);
            break;
        }
      } catch (error) {
        console.error('❌ Erreur traitement message:', error);
      }
    };

    this.ws.onopen = () => {
      console.log("✅ Connecté au serveur de signalement");
    };

    this.ws.onerror = (error) => {
      console.error("❌ Erreur WebSocket:", error);
    };

    this.ws.onclose = () => {
      console.log("🔌 Connexion WebSocket fermée");
    };
  }

  updateLocalVideoId(newId: string) {
    const container = document.getElementById('videoContainer');
    if (!container) return;
    
    console.log('🔄 Mise à jour ID local de "local" vers:', newId);
    
    const tempWrapper = container.querySelector('[data-peer-id="local"]');
    
    if (tempWrapper) {
      tempWrapper.setAttribute('data-peer-id', newId);
      console.log(`✅ ID vidéo locale mis à jour: ${newId}`);
      
      // Vérification
      const checkWrapper = container.querySelector(`[data-peer-id="${newId}"]`);
      console.log('🔍 Vérification wrapper avec nouveau ID:', checkWrapper ? 'TROUVÉ ✅' : 'PAS TROUVÉ ❌');
      
      const localParticipant = this.participants.find(p => p.id === 'local');
      if (localParticipant) {
        localParticipant.id = newId;
      }
    } else {
      console.log('⚠️ Wrapper "local" non trouvé');
    }
  }

  async createPeerAndSendOffer(peerId: string, peerName: string) {
    try {
      if (this.peers[peerId]) {
        delete this.processingOffers[peerId];
        return;
      }

      const pc = this.createPeerConnection(peerId, peerName);
      this.peers[peerId] = pc;
      this.updatePeerCount();

      await new Promise(resolve => setTimeout(resolve, 500));

      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      await pc.setLocalDescription(offer);

      this.ws.send(JSON.stringify({
        type: 'offer',
        target: peerId,
        offer: offer,
        name: this.username
      }));

      delete this.processingOffers[peerId];
    } catch (error) {
      console.error('❌ Erreur création offre:', error);
      delete this.processingOffers[peerId];
    }
  }

  createPeerConnection(peerId: string, name?: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({ 
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
      ] 
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        const displayName = name || this.peerNames[peerId] || peerId;
        
        this.ngZone.run(() => {
          setTimeout(() => {
            this.addVideo(event.streams[0], displayName, false, peerId);
          }, 100);
        });
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.ws.send(JSON.stringify({ 
          type: 'ice-candidate', 
          target: peerId, 
          candidate: event.candidate 
        }));
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`🔄 État ICE pour ${peerId}:`, pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log(`🔗 État connexion pour ${peerId}:`, pc.connectionState);
    };

    return pc;
  }

  updatePeerCount() {
    this.peerCount = Object.keys(this.peers).length;
  }

  addVideo(stream: MediaStream, name: string, muted: boolean, peerId: string) {
    const container = document.getElementById('videoContainer');
    if (!container) return;

    const existingVideo = container.querySelector(`[data-peer-id="${peerId}"]`);
    if (existingVideo) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'video-wrapper';
    wrapper.setAttribute('data-peer-id', peerId);

    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.muted = muted;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      video.play().catch(e => console.error('Erreur play video:', e));
    };

    const label = document.createElement('div');
    label.className = 'video-label';
    
    const micIcon = document.createElement('i');
    micIcon.className = muted ? 'fas fa-microphone-slash muted' : 'fas fa-microphone';
    label.appendChild(micIcon);
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = muted ? `${name} (Moi)` : name;
    label.appendChild(nameSpan);

    wrapper.appendChild(video);
    wrapper.appendChild(label);
    container.appendChild(wrapper);

    if (!muted && peerId !== 'local' && peerId !== this.wsId) {
      this.setupAudioDetectionForPeer(stream, peerId, wrapper);
    }
  }

  setupAudioDetectionForPeer(stream: MediaStream, peerId: string, wrapper: HTMLElement) {
    try {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        
        if (average > 50) {
          wrapper.classList.add('speaking');
          this.speakingUsers.add(peerId);
          
          const participant = this.participants.find(p => p.id === peerId);
          if (participant) {
            participant.isSpeaking = true;
          }
        } else {
          wrapper.classList.remove('speaking');
          this.speakingUsers.delete(peerId);
          
          const participant = this.participants.find(p => p.id === peerId);
          if (participant) {
            participant.isSpeaking = false;
          }
        }
        
        const frameId = requestAnimationFrame(checkAudio);
        this.animationFrames.set(peerId, frameId);
      };

      checkAudio();
      this.audioContexts.set(peerId, audioContext);
    } catch (error) {
      console.error('Erreur setup audio detection:', error);
    }
  }

  setupAudioDetection() {
    if (this.localStream) {
      try {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(this.localStream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkLocalAudio = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          
          const localParticipant = this.participants.find(p => p.id === 'local' || p.id === this.wsId);
          if (localParticipant) {
            localParticipant.isSpeaking = average > 50;
          }
          
          requestAnimationFrame(checkLocalAudio);
        };

        checkLocalAudio();
      } catch (error) {
        console.error('Erreur setup audio detection locale:', error);
      }
    }
  }

  removeUserVideo(peerId: string) {
    const container = document.getElementById('videoContainer');
    if (!container) return;
    
    const wrappers = container.querySelectorAll(`[data-peer-id="${peerId}"]`);
    
    wrappers.forEach(wrapper => {
      if (this.animationFrames.has(peerId)) {
        cancelAnimationFrame(this.animationFrames.get(peerId)!);
        this.animationFrames.delete(peerId);
      }
      
      if (this.audioContexts.has(peerId)) {
        this.audioContexts.get(peerId)?.close();
        this.audioContexts.delete(peerId);
      }
      
      const video = wrapper.querySelector('video');
      if (video) {
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
        }
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      
      wrapper.remove();
    });
  }

  // ==================== FACE DETECTION METHODS ====================

  async checkMLService() {
    try {
      await this.faceDetectionService.checkHealth().toPromise();
      this.mlServiceAvailable = true;
      console.log('✅ ML Service disponible');
    } catch (error) {
      this.mlServiceAvailable = false;
      console.error('❌ ML Service non disponible');
    }
  }

  toggleFaceDetection() {
    if (!this.mlServiceAvailable) {
      alert('Service ML non disponible. Vérifiez que l\'API FastAPI est lancée sur http://localhost:8000');
      return;
    }
    
    this.faceDetectionEnabled = !this.faceDetectionEnabled;
    
    if (this.faceDetectionEnabled) {
      this.startFaceDetection();
    } else {
      this.stopFaceDetection();
    }
  }

  startFaceDetection() {
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
    }
    
    this.faceDetectionInterval = setInterval(() => {
      this.captureAndDetectFace();
    }, 5000);
    
    console.log('🔄 Face detection démarrée');
  }

  stopFaceDetection() {
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    console.log('⏹️ Face detection arrêtée');
  }

  captureAndDetectFace() {
    // Essayer avec wsId d'abord
    let videoElement = document.querySelector(`[data-peer-id="${this.wsId}"] video`) as HTMLVideoElement;
    
    console.log('🔍 Recherche vidéo avec peer-id:', this.wsId);
    console.log('📹 Vidéo trouvée?', videoElement ? 'OUI ✅' : 'NON ❌');
    
    // Si pas trouvé, essayer avec "local"
    if (!videoElement) {
      console.log('🔄 Tentative avec peer-id "local"');
      videoElement = document.querySelector(`[data-peer-id="local"] video`) as HTMLVideoElement;
      console.log('📹 Vidéo "local" trouvée?', videoElement ? 'OUI ✅' : 'NON ❌');
    }
    
    if (!videoElement) {
      console.log('⚠️ Aucune vidéo trouvée');
      return;
    }
    
    if (!videoElement.videoWidth) {
      console.log('⏸️ Vidéo pas prête (largeur:', videoElement.videoWidth, 'hauteur:', videoElement.videoHeight);
      return;
    }
    
    console.log(`📸 Capture frame: ${videoElement.videoWidth}x${videoElement.videoHeight}`);
    
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) {
        console.log('❌ Blob vide');
        return;
      }
      
      console.log(`📦 Blob créé: ${(blob.size / 1024).toFixed(2)} KB`);
      
      this.faceDetectionService.detectFace(blob).subscribe({
        next: (result) => {
          this.ngZone.run(() => {
            this.currentFaceDetection = result;
            this.faceDetectionHistory.unshift(result);
            
            if (this.faceDetectionHistory.length > 5) {
              this.faceDetectionHistory.pop();
            }
            
            console.log(`👤 Face detection: ${result.class_name} (${(result.confidence*100).toFixed(1)}%)`);
            console.log('📊 Probabilités:', result.probabilities);
            
            if (result.class_name !== 'visible') {
              this.showFaceDetectionWarning(result);
            }
          });
        },
        error: (error) => {
          console.error('❌ Erreur face detection:', error);
        }
      });
    }, 'image/jpeg', 0.7);
  }

  showFaceDetectionWarning(result: FaceDetectionResult) {
    const warningMessage = result.class_name === 'covered' 
      ? '⚠️ Attention: Visage partiellement couvert détecté' 
      : '⚠️ Attention: Aucun visage détecté';
    
    this.messages.push({
      sender: 'Système',
      text: warningMessage,
      time: new Date().toLocaleTimeString(),
      isOwn: false
    });
    
    const wrapper = document.querySelector(`[data-peer-id="${this.wsId}"]`) || 
                    document.querySelector(`[data-peer-id="local"]`);
                    
    if (wrapper) {
      wrapper.classList.add('face-warning');
      setTimeout(() => {
        wrapper.classList.remove('face-warning');
      }, 2000);
    }
  }

  getFaceDetectionColor(className: string): string {
    const colors: { [key: string]: string } = {
      'visible': '#4caf50',
      'covered': '#ff9800',
      'no_face': '#f44336'
    };
    return colors[className] || '#999';
  }

  // ==================== UI METHODS ====================

  toggleMicro() {
    this.microEnabled = !this.microEnabled;
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = this.microEnabled;
      });
      
      this.ws.send(JSON.stringify({
        type: 'audio-mute',
        muted: !this.microEnabled
      }));
      
      const localParticipant = this.participants.find(p => p.id === 'local' || p.id === this.wsId);
      if (localParticipant) {
        localParticipant.audioMuted = !this.microEnabled;
      }
      
      const wrapper = document.querySelector(`[data-peer-id="${this.wsId}"] .video-label i`) ||
                      document.querySelector(`[data-peer-id="local"] .video-label i`);
      if (wrapper) {
        wrapper.className = this.microEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash muted';
      }
    }
  }

  toggleCamera() {
    this.cameraEnabled = !this.cameraEnabled;
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = this.cameraEnabled;
      });
      
      this.ws.send(JSON.stringify({
        type: 'video-mute',
        muted: !this.cameraEnabled
      }));
      
      const localParticipant = this.participants.find(p => p.id === 'local' || p.id === this.wsId);
      if (localParticipant) {
        localParticipant.videoMuted = !this.cameraEnabled;
      }
      
      const video = document.querySelector(`[data-peer-id="${this.wsId}"] video`) as HTMLVideoElement ||
                    document.querySelector(`[data-peer-id="local"] video`) as HTMLVideoElement;
      if (video) {
        if (!this.cameraEnabled) {
          video.style.filter = 'grayscale(100%)';
          video.style.opacity = '0.7';
        } else {
          video.style.filter = 'none';
          video.style.opacity = '1';
        }
      }
    }
  }

  async toggleScreenShare() {
    if (!this.screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true 
        });
        
        const videoTrack = screenStream.getVideoTracks()[0];
        
        Object.values(this.peers).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) {
            sender.replaceTrack(videoTrack);
          }
        });
        
        videoTrack.onended = () => {
          this.stopScreenSharing();
        };
        
        this.screenSharing = true;
        
        const screenBtn = document.querySelector('.btn-icon .fa-desktop')?.parentElement;
        if (screenBtn) {
          screenBtn.classList.add('active');
        }
      } catch (error) {
        console.error('Erreur partage écran:', error);
      }
    } else {
      this.stopScreenSharing();
    }
  }

  stopScreenSharing() {
    const videoTrack = this.localStream.getVideoTracks()[0];
    
    Object.values(this.peers).forEach(pc => {
      const sender = pc.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(videoTrack);
      }
    });
    
    this.screenSharing = false;
    
    const screenBtn = document.querySelector('.btn-icon .fa-desktop')?.parentElement;
    if (screenBtn) {
      screenBtn.classList.remove('active');
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
    if (this.showChat) {
      setTimeout(() => this.scrollChatToBottom(), 100);
    }
  }

  toggleParticipants() {
    this.showParticipants = !this.showParticipants;
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.ws.send(JSON.stringify({
        type: 'chat',
        message: this.newMessage,
        name: this.username
      }));
      
      this.newMessage = '';
    }
  }

  scrollChatToBottom() {
    setTimeout(() => {
      if (this.chatMessagesRef) {
        const element = this.chatMessagesRef.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  updateParticipantMute(peerId: string, type: 'audio' | 'video', muted: boolean) {
    const participant = this.participants.find(p => p.id === peerId);
    if (participant) {
      if (type === 'audio') {
        participant.audioMuted = muted;
        
        const wrapper = document.querySelector(`[data-peer-id="${peerId}"] .video-label i`);
        if (wrapper) {
          wrapper.className = muted ? 'fas fa-microphone-slash muted' : 'fas fa-microphone';
        }
      } else {
        participant.videoMuted = muted;
        
        const video = document.querySelector(`[data-peer-id="${peerId}"] video`) as HTMLVideoElement;
        if (video) {
          if (muted) {
            video.style.filter = 'grayscale(100%)';
            video.style.opacity = '0.7';
          } else {
            video.style.filter = 'none';
            video.style.opacity = '1';
          }
        }
      }
    }
  }

  leaveRoom() {
    this.ngOnDestroy();
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    console.log('🧹 Nettoyage composant');
    
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
    }
    
    this.animationFrames.forEach((frameId) => {
      cancelAnimationFrame(frameId);
    });
    this.animationFrames.clear();
    
    this.audioContexts.forEach((context) => {
      context.close();
    });
    this.audioContexts.clear();
    
    Object.values(this.peers).forEach(pc => {
      const receivers = pc.getReceivers();
      receivers.forEach(receiver => {
        if (receiver.track) {
          receiver.track.stop();
        }
      });
      pc.close();
    });
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
    
    const container = document.getElementById('videoContainer');
    if (container) {
      container.innerHTML = '';
    }
  }
}