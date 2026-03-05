import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaceDetectionService, FaceDetectionResult } from '../service/face-detection.service';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.css'],
})
export class VideoRoomComponent implements OnInit, OnDestroy {

  @ViewChild('chatMessages') chatMessagesRef!: ElementRef;

  // WebRTC properties
  peers: { [key: string]: RTCPeerConnection } = {};
  localStream!: MediaStream;
  private ws!: WebSocket;
  wsId: string = '';
  
  username!: string;
  
  peerNames: { [key: string]: string } = {};
  processingOffers: { [key: string]: boolean } = {};
  
  // UI properties
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

  // WebSocket improvements
  private messageQueue: any[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval: any = null;
  private coursId: string | null = null;
  private token: string | null = null;
  private isAuthenticated = false;

  // Additional properties
  participantSearch: string = '';
  isTyping: boolean = false;

  // ==================== TYPING INDICATOR PROPERTIES ====================
  typingUsers: Set<string> = new Set();
  private typingTimeout: any = null;
  private typingDebounceTime = 1000; // 1 second without typing = stop

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private faceDetectionService: FaceDetectionService
  ) {}

  async ngOnInit() {
    this.coursId = this.route.snapshot.paramMap.get('id');
    this.token = localStorage.getItem('token');
    this.username = localStorage.getItem('username') || 'Me';

    console.log('🚀 Initializing with username:', this.username);
    console.log('🔑 Token present:', !!this.token);

    // Initialize WebSocket
    this.initWebSocket();

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: true 
      });
      console.log('📹 Local stream obtained');
      
      this.addVideo(this.localStream, this.username, true, 'local');
      
      this.participants.push({
        id: 'local',
        name: `${this.username} (Me)`,
        isSpeaking: false,
        audioMuted: false,
        videoMuted: false
      });
    } catch (error) {
      console.error('❌ Camera access error:', error);
      alert('Unable to access camera/microphone');
    }

    this.setupAudioDetection();
    await this.checkMLService();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.messages.push({
        sender: 'System',
        text: '👋 Welcome to the room! You can now chat.',
        time: new Date().toLocaleTimeString(),
        isOwn: false
      });
    }, 1000);
  }

  // ==================== TYPING INDICATOR METHODS ====================

  onTyping() {
    // Send typing signal
    this.safeSendWebSocket({
      type: 'typing',
      isTyping: true,
      name: this.username
    });

    // Clear previous timeout
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    // Set new timeout to stop typing after 1 second of inactivity
    this.typingTimeout = setTimeout(() => {
      this.onStopTyping();
    }, this.typingDebounceTime);
  }

  onStopTyping() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = null;
    }

    this.safeSendWebSocket({
      type: 'typing',
      isTyping: false,
      name: this.username
    });
  }

  getTypingUsersList(): string[] {
    return Array.from(this.typingUsers);
  }

  getTypingMessage(): string {
    const typingList = Array.from(this.typingUsers);
    
    if (typingList.length === 0) return '';
    if (typingList.length === 1) return `${typingList[0]} is typing...`;
    if (typingList.length === 2) return `${typingList[0]} and ${typingList[1]} are typing...`;
    
    return `${typingList[0]} and ${typingList.length - 1} others are typing...`;
  }

  // ==================== WEBSOCKET WITH API GATEWAY ====================

  initWebSocket() {
    if (this.ws) {
        try {
            this.ws.close();
        } catch (e) {}
    }
    
    if (!this.coursId || !this.token) {
        console.error('❌ Missing coursId or token');
        this.showConnectionError('Missing session credentials');
        return;
    }
    
    console.log('🔑 Token used:', this.token.substring(0, 20) + '...');
    
    const wsUrl = `ws://localhost:8090/room/${this.coursId}?token=${this.token}`;
    console.log('🔌 Attempting WebSocket connection to:', wsUrl);
    
    try {
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
            console.log("✅ Connected to API Gateway");
            this.reconnectAttempts = 0;
            
            const authMessage = {
                type: 'auth',
                token: this.token
            };
            console.log('📤 Sending authentication...');
            this.ws.send(JSON.stringify(authMessage));
        };
        
        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('📩 Message received:', data);
                this.handleWebSocketMessage(data);
            } catch (error) {
                console.error('❌ Error parsing message:', error);
            }
        };
        
        this.ws.onerror = (error) => {
            console.error("❌ WebSocket error:", error);
        };
        
        this.ws.onclose = (event) => {
            console.log(`🔌 WebSocket connection closed: ${event.reason || 'Unknown'} (code: ${event.code})`);
            
            if (event.code === 1006) {
                console.log('⚠️ Code 1006 = Authentication probably refused or timeout');
            }
            
            if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.reconnect();
            }
        };
        
    } catch (error) {
        console.error('❌ Error creating WebSocket:', error);
        this.showConnectionError('Unable to create connection');
    }
  }

  private handleWebSocketMessage(data: any) {
    console.log('📩 Message received:', data);

    if (data.type === 'your-id') {
      this.wsId = data.id;
      console.log('🆔 My ID received from server:', this.wsId);
      this.isAuthenticated = true;
      
      setTimeout(() => {
        console.log('📤 Joining room...');
        this.safeSendWebSocket({
          type: 'join',
          name: this.username
        });
      }, 500);
      
      setTimeout(() => {
        this.updateLocalVideoId(this.wsId);
      }, 500);
      return;
    }

    // ===== TYPING INDICATOR =====
    if (data.type === 'typing') {
      this.ngZone.run(() => {
        const userName = data.name || 'Someone';
        
        if (data.isTyping) {
          this.typingUsers.add(userName);
        } else {
          this.typingUsers.delete(userName);
        }
      });
      return;
    }

    switch (data.type) {
      case 'chat':
        const isOwn = data.from === this.wsId;
        this.messages.push({
          sender: data.name || 'Unknown',
          text: data.message,
          time: new Date().toLocaleTimeString(),
          isOwn: isOwn
        });
        this.scrollChatToBottom();
        
        // Stop typing when receiving a message
        if (!isOwn && this.typingUsers.has(data.name)) {
          this.typingUsers.delete(data.name);
        }
        break;

      case 'existing-user':
      case 'new-user':
        console.log(`👥 ${data.type}:`, data.name, data.id);
        this.peerNames[data.id] = data.name;
        
        if (!this.participants.find(p => p.id === data.id)) {
          this.participants.push({
            id: data.id,
            name: data.name,
            isSpeaking: false,
            audioMuted: false,
            videoMuted: false
          });
        }
        
        if (data.id !== this.wsId && !this.peers[data.id] && !this.processingOffers[data.id]) {
          console.log(`🔄 Creating peer for ${data.name}`);
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
          this.peers[data.from].setRemoteDescription(new RTCSessionDescription(data.offer))
            .then(() => {
              return this.peers[data.from].createAnswer();
            })
            .then((answer) => {
              return this.peers[data.from].setLocalDescription(answer);
            })
            .then(() => {
              this.safeSendWebSocket({
                type: 'answer',
                target: data.from,
                answer: this.peers[data.from].localDescription,
                name: this.username
              });
            })
            .catch(err => {
              console.error('❌ Error processing offer:', err);
            });
        } catch (err) {
          console.error('❌ Error processing offer:', err);
        }
        break;

      case 'answer':
        if (data.from === this.wsId) return;
        this.peerNames[data.from] = data.name;
        
        if (this.peers[data.from]) {
          this.peers[data.from].setRemoteDescription(new RTCSessionDescription(data.answer))
            .catch(err => {
              console.error('❌ Error processing answer:', err);
            });
        }
        break;

      case 'ice-candidate':
        if (data.from !== this.wsId && this.peers[data.from]) {
          this.peers[data.from].addIceCandidate(new RTCIceCandidate(data.candidate))
            .catch(err => {
              console.error('❌ Error adding ICE candidate:', err);
            });
        }
        break;

      case 'user-left':
        console.log(`👋 User left: ${data.name} (${data.id})`);
        
        this.participants = this.participants.filter(p => p.id !== data.id);
        this.typingUsers.delete(data.name); // Remove from typing users
        
        this.ngZone.run(() => {
          this.removeUserVideo(data.id);
          
          this.messages.push({
            sender: 'System',
            text: `👋 ${data.name} left the room`,
            time: new Date().toLocaleTimeString(),
            isOwn: false
          });
          
          setTimeout(() => {
            this.forceRefreshVideoContainer();
            this.updatePeerCount();
          }, 50);
        });
        
        if (this.peers[data.id]) {
          delete this.peers[data.id];
        }
        
        delete this.peerNames[data.id];
        break;

      case 'audio-mute':
        this.updateParticipantMute(data.from, 'audio', data.muted);
        break;

      case 'video-mute':
        this.updateParticipantMute(data.from, 'video', data.muted);
        break;
    }
  }

  private safeSendWebSocket(data: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.isAuthenticated) {
      try {
        this.ws.send(JSON.stringify(data));
        return true;
      } catch (error) {
        console.error('❌ WebSocket send error:', error);
        this.addToMessageQueue(data);
        return false;
      }
    } else {
      console.warn(`⚠️ WebSocket unavailable (state: ${this.ws?.readyState}, auth: ${this.isAuthenticated}), message queued`);
      this.addToMessageQueue(data);
      
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.reconnect();
      }
      
      return false;
    }
  }

  private addToMessageQueue(data: any) {
    this.messageQueue.push(data);
    console.log(`📦 Message queued (${this.messageQueue.length} messages waiting)`);
  }

  private processMessageQueue() {
    if (this.messageQueue.length === 0) return;
    
    console.log(`🔄 Processing ${this.messageQueue.length} queued messages...`);
    
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.ws && this.ws.readyState === WebSocket.OPEN && this.isAuthenticated) {
        this.ws.send(JSON.stringify(message));
      } else {
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  private reconnect() {
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
    }
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(10000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
      
      if (this.reconnectAttempts === 1) {
        this.messages.push({
          sender: 'System',
          text: '🔄 Connection lost, attempting to reconnect...',
          time: new Date().toLocaleTimeString(),
          isOwn: false
        });
      }
      
      this.reconnectInterval = setTimeout(() => {
        console.log(`🔄 Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.isAuthenticated = false;
        this.initWebSocket();
      }, delay);
    } else {
      console.error('❌ Maximum reconnection attempts reached');
      this.messages.push({
        sender: 'System',
        text: '❌ Unable to reconnect. Please refresh the page.',
        time: new Date().toLocaleTimeString(),
        isOwn: false
      });
    }
  }

  showConnectionError(message: string) {
    this.messages.push({
      sender: 'System',
      text: `⚠️ Connection error: ${message}. Check that the API Gateway is running on http://localhost:8090`,
      time: new Date().toLocaleTimeString(),
      isOwn: false
    });
  }

  // ==================== FACE DETECTION METHODS ====================

  async checkMLService() {
    try {
      await this.faceDetectionService.checkHealth().toPromise();
      this.mlServiceAvailable = true;
      console.log('✅ ML Service available');
    } catch (error) {
      this.mlServiceAvailable = false;
      console.error('❌ ML Service unavailable');
    }
  }

  toggleFaceDetection() {
    if (!this.mlServiceAvailable) {
      alert('ML Service unavailable. Check that FastAPI is running on http://localhost:8000');
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
    
    console.log('🔄 Face detection started');
  }

  stopFaceDetection() {
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    console.log('⏹️ Face detection stopped');
  }

  captureAndDetectFace() {
    let videoElement = document.querySelector(`[data-peer-id="${this.wsId}"] video`) as HTMLVideoElement;
    
    if (!videoElement) {
      videoElement = document.querySelector(`[data-peer-id="local"] video`) as HTMLVideoElement;
    }
    
    if (!videoElement) {
      console.log('⚠️ No video found');
      return;
    }
    
    if (!videoElement.videoWidth) {
      return;
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (!blob) return;
      
      this.faceDetectionService.detectFace(blob).subscribe({
        next: (result) => {
          this.ngZone.run(() => {
            this.currentFaceDetection = result;
            this.faceDetectionHistory.unshift(result);
            
            if (this.faceDetectionHistory.length > 5) {
              this.faceDetectionHistory.pop();
            }
            
            if (result.class_name !== 'visible') {
              this.showFaceDetectionWarning(result);
            }
          });
        },
        error: (error) => {
          console.error('❌ Face detection error:', error);
        }
      });
    }, 'image/jpeg', 0.7);
  }

  showFaceDetectionWarning(result: FaceDetectionResult) {
    const warningMessage = result.class_name === 'covered' 
      ? '⚠️ Warning: Partially covered face detected' 
      : '⚠️ Warning: No face detected';
    
    this.messages.push({
      sender: 'System',
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
      
      this.safeSendWebSocket({
        type: 'audio-mute',
        muted: !this.microEnabled
      });
      
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
      
      this.safeSendWebSocket({
        type: 'video-mute',
        muted: !this.cameraEnabled
      });
      
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
        console.error('Screen sharing error:', error);
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
      const messageText = this.newMessage;
      const messageData = {
        type: 'chat',
        message: messageText,
        name: this.username
      };
      
      // ADD MESSAGE LOCALLY IMMEDIATELY
      this.messages.push({
        sender: this.username,
        text: messageText,
        time: new Date().toLocaleTimeString(),
        isOwn: true  // Important: mark as "my message"
      });
      
      // Send via WebSocket
      this.safeSendWebSocket(messageData);
      
      // Stop typing after sending
      this.onStopTyping();
      
      this.newMessage = '';
      this.scrollChatToBottom();
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

  // ==================== IMPROVED CLEANUP METHODS ====================

  removeUserVideo(peerId: string) {
    console.log(`🗑️ Removing video for ${peerId}`);
    
    const container = document.getElementById('videoContainer');
    if (!container) return;
    
    const wrappers = container.querySelectorAll(`[data-peer-id="${peerId}"]`);
    
    wrappers.forEach(wrapper => {
      console.log(`🧹 Cleaning wrapper for ${peerId}`);
      
      // 1. Stop animation frame
      if (this.animationFrames.has(peerId)) {
        cancelAnimationFrame(this.animationFrames.get(peerId)!);
        this.animationFrames.delete(peerId);
        console.log(`⏹️ Animation frame stopped for ${peerId}`);
      }
      
      // 2. Close and clean audio context
      if (this.audioContexts.has(peerId)) {
        this.audioContexts.get(peerId)?.close();
        this.audioContexts.delete(peerId);
        console.log(`🔇 Audio context closed for ${peerId}`);
      }
      
      // 3. Clean video
      const video = wrapper.querySelector('video');
      if (video) {
        console.log(`🎥 Cleaning video for ${peerId}`);
        
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach(track => {
            track.stop();
            console.log(`⏹️ Track stopped: ${track.kind}`);
          });
          video.srcObject = null;
        }
        
        video.pause();
        video.removeAttribute('src');
        video.load();
        
        while (video.firstChild) {
          video.removeChild(video.firstChild);
        }
      }
      
      // 4. Remove wrapper from DOM
      wrapper.remove();
      console.log(`✅ Wrapper removed for ${peerId}`);
    });
    
    // 5. Clean peer connection
    if (this.peers[peerId]) {
      console.log(`🔌 Closing peer connection for ${peerId}`);
      const pc = this.peers[peerId];
      
      const receivers = pc.getReceivers();
      receivers.forEach(receiver => {
        if (receiver.track) {
          receiver.track.stop();
        }
      });
      
      pc.close();
      delete this.peers[peerId];
      console.log(`✅ Peer connection closed for ${peerId}`);
    }
    
    // 6. Clean references
    delete this.peerNames[peerId];
    this.speakingUsers.delete(peerId);
    
    // 7. Update counter
    this.updatePeerCount();
    
    // 8. Force refresh
    setTimeout(() => {
      this.forceRefreshVideoContainer();
    }, 100);
    
    console.log(`📊 New peer count: ${this.peerCount}`);
  }

  forceRefreshVideoContainer() {
    const container = document.getElementById('videoContainer');
    if (container) {
      const allWrappers = container.querySelectorAll('[data-peer-id]');
      console.log(`🔍 Verification: ${allWrappers.length} wrappers in container`);
      
      allWrappers.forEach(wrapper => {
        const peerId = wrapper.getAttribute('data-peer-id');
        if (peerId && peerId !== this.wsId && !this.peers[peerId] && peerId !== 'local') {
          console.log(`🧹 Cleaning orphan wrapper: ${peerId}`);
          const video = wrapper.querySelector('video');
          if (video) {
            if (video.srcObject) {
              (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
            }
            video.srcObject = null;
          }
          wrapper.remove();
        }
      });
    }
  }

  // ==================== WEBCAM METHODS ====================

  updateLocalVideoId(newId: string) {
    const container = document.getElementById('videoContainer');
    if (!container) return;
    
    console.log('🔄 Updating local ID from "local" to:', newId);
    
    const tempWrapper = container.querySelector('[data-peer-id="local"]');
    
    if (tempWrapper) {
      tempWrapper.setAttribute('data-peer-id', newId);
      console.log(`✅ Local video ID updated: ${newId}`);
      
      const localParticipant = this.participants.find(p => p.id === 'local');
      if (localParticipant) {
        localParticipant.id = newId;
      }
    } else {
      console.log('⚠️ "local" wrapper not found');
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

      this.safeSendWebSocket({
        type: 'offer',
        target: peerId,
        offer: offer,
        name: this.username
      });

      delete this.processingOffers[peerId];
    } catch (error) {
      console.error('❌ Error creating offer:', error);
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
        this.safeSendWebSocket({ 
          type: 'ice-candidate', 
          target: peerId, 
          candidate: event.candidate 
        });
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log(`🔄 ICE state for ${peerId}:`, pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log(`🔗 Connection state for ${peerId}:`, pc.connectionState);
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
      video.play().catch(e => console.error('Error playing video:', e));
    };

    const label = document.createElement('div');
    label.className = 'video-label';
    
    const micIcon = document.createElement('i');
    micIcon.className = muted ? 'fas fa-microphone-slash muted' : 'fas fa-microphone';
    label.appendChild(micIcon);
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = muted ? `${name} (Me)` : name;
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
      console.error('Error setting up audio detection:', error);
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
        console.error('Error setting up local audio detection:', error);
      }
    }
  }

  // ==================== UTILITY METHODS ====================

  get filteredParticipants() {
    if (!this.participantSearch) return this.participants;
    return this.participants.filter(p => 
      p.name.toLowerCase().includes(this.participantSearch.toLowerCase())
    );
  }

  getInviteLink(): string {
    return window.location.href;
  }

  copyInviteLink() {
    navigator.clipboard.writeText(this.getInviteLink()).then(() => {
      this.messages.push({
        sender: 'System',
        text: '🔗 Invitation link copied to clipboard',
        time: new Date().toLocaleTimeString(),
        isOwn: false
      });
    });
  }

  getFaceStatusLabel(className: string): string {
    const labels: { [key: string]: string } = {
      'visible': 'Face detected',
      'covered': 'Partially covered face',
      'no_face': 'No face'
    };
    return labels[className] || className;
  }

  getAvatarColor(id: string): string {
    const colors = [
      '#1a73e8', '#34a853', '#fbbc04', '#ea4335', 
      '#9334e8', '#e834a8', '#34e8a8', '#e8a834'
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getAvatarInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  onChatFocus() {
    this.onTyping();
  }

  onChatBlur() {
    this.onStopTyping();
    this.isTyping = false;
  }

  ngOnDestroy() {
    console.log('🧹 Complete component cleanup');
    
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    
    if (this.reconnectInterval) {
      clearTimeout(this.reconnectInterval);
      this.reconnectInterval = null;
    }
    
    if (this.faceDetectionInterval) {
      clearInterval(this.faceDetectionInterval);
      this.faceDetectionInterval = null;
    }
    
    this.messageQueue = [];
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'leave' }));
        setTimeout(() => this.ws.close(), 100);
      } catch (e) {
        this.ws.close();
      }
    }
    
    this.animationFrames.forEach((frameId, peerId) => {
      cancelAnimationFrame(frameId);
      console.log(`⏹️ Animation stopped for ${peerId}`);
    });
    this.animationFrames.clear();
    
    this.audioContexts.forEach((context, peerId) => {
      context.close();
      console.log(`🔇 Audio context closed for ${peerId}`);
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
    this.peers = {};
    
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
        console.log(`⏹️ Local track stopped: ${track.kind}`);
      });
      this.localStream = null as any;
    }
    
    const container = document.getElementById('videoContainer');
    if (container) {
      const videos = container.querySelectorAll('video');
      videos.forEach(video => {
        if (video.srcObject) {
          (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
        video.pause();
        video.removeAttribute('src');
        video.load();
      });
      
      container.innerHTML = '';
      console.log('🧹 Video container cleared');
    }
    
    console.log('✅ Cleanup complete');
  }
}