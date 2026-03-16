import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  NgZone,
  HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';

/* ═══════════════════════════════════════════
   Building descriptor
   ═══════════════════════════════════════════ */
interface BuildingInfo {
  label: string;
  icon: string;
  description: string;
  route: string;
  color: number;
  roofColor: number;
  emissiveColor: number;
  position: [number, number];
  width: number;
  depth: number;
  height: number;
  group?: THREE.Group;
}

@Component({
  selector: 'app-explore3d',
  templateUrl: './explore3d.component.html',
  styleUrls: ['./explore3d.component.css']
})
export class Explore3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas3d', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  /* ── Public template state ── */
  isLoading = true;
  showInstructions = true;
  nearBuilding: BuildingInfo | null = null;
  interactPrompt = false;

  /* ── Three.js core ── */
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animFrameId = 0;

  /* ── Avatar ── */
  private avatar!: THREE.Group;
  private avatarPos = new THREE.Vector3(4, 0, 4);   // ★ spawn OUTSIDE fountain
  private avatarTargetAngle = 0;
  private avatarAngle = 0;
  private avatarSpeed = 9;
  private avatarRunSpeed = 16;
  private isMoving = false;

  /* ── Camera ── */
  private camOffset = new THREE.Vector3(0, 16, 13);
  private camLookOffset = new THREE.Vector3(0, 1, -3);

  /* ── Input ── */
  private keys: Record<string, boolean> = {};

  /* ── Scene objects for animation ── */
  private floatingOrbs: THREE.Mesh[] = [];
  private avatarGlow!: THREE.PointLight;

  /* ── Buildings ── */
  buildings: BuildingInfo[] = [
    {
      label: 'Courses Academy', icon: '📚',
      description: 'Browse expert-led programming courses',
      route: '/front/courses',
      color: 0x5b5fc7, roofColor: 0x818cf8, emissiveColor: 0x6366f1,
      position: [-14, -12], width: 7.5, depth: 6.5, height: 5.5
    },
    {
      label: 'Digital Library', icon: '📖',
      description: 'Explore the digital book collection',
      route: '/front/library',
      color: 0x7c5bbf, roofColor: 0xa78bfa, emissiveColor: 0x8b5cf6,
      position: [14, -12], width: 7.5, depth: 6.5, height: 6.5
    },
    {
      label: 'Learner Dashboard', icon: '📊',
      description: 'Track your learning progress',
      route: '/dashboardLearner',
      color: 0x0891b2, roofColor: 0x22d3ee, emissiveColor: 0x06b6d4,
      position: [-14, 12], width: 6.5, depth: 6, height: 4.5
    },
    {
      label: 'Services Center', icon: '⚙️',
      description: 'Discover platform services & tools',
      route: '/services',
      color: 0xd97706, roofColor: 0xfbbf24, emissiveColor: 0xf59e0b,
      position: [14, 12], width: 6.5, depth: 6, height: 5
    },
    {
      label: 'Info Tower', icon: 'ℹ️',
      description: 'Learn about the Aletheia platform',
      route: '/about',
      color: 0x059669, roofColor: 0x34d399, emissiveColor: 0x10b981,
      position: [0, -20], width: 5.5, depth: 5.5, height: 8
    },
    {
      label: 'Community Hub', icon: '👥',
      description: 'Connect with fellow learners',
      route: '/contact',
      color: 0xdb2777, roofColor: 0xf472b6, emissiveColor: 0xec4899,
      position: [0, 20], width: 6.5, depth: 5.5, height: 4.5
    }
  ];

  constructor(private ngZone: NgZone, private router: Router) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initScene();
      this.buildGround();
      this.buildRoads();
      this.buildAllBuildings();
      this.buildTrees();
      this.buildLamps();
      this.buildFountain();
      this.buildFloatingOrbs();
      this.createAvatar();
      this.isLoading = false;
      this.animate();
    });
    setTimeout(() => { this.showInstructions = false; }, 7000);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.renderer?.dispose();
  }

  /* ═══════════════════════════════════════════
     SCENE
     ═══════════════════════════════════════════ */
  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f0f23);
    this.scene.fog = new THREE.FogExp2(0x0f0f23, 0.012);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 250);
    this.camera.position.set(4, 16, 17);

    /* ── Lighting ── */
    this.scene.add(new THREE.AmbientLight(0x303050, 0.5));
    const hemi = new THREE.HemisphereLight(0x7c83ff, 0x0f0f23, 0.5);
    this.scene.add(hemi);

    const moon = new THREE.DirectionalLight(0xddeeff, 0.9);
    moon.position.set(-20, 30, -10);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    const sc = moon.shadow.camera;
    sc.left = -35; sc.right = 35; sc.top = 35; sc.bottom = -35;
    sc.near = 1; sc.far = 80;
    this.scene.add(moon);

    /* warm fill from opposite side */
    const fill = new THREE.DirectionalLight(0xffd4a0, 0.25);
    fill.position.set(20, 15, 15);
    this.scene.add(fill);

    /* Stars */
    const starCount = 1200;
    const sp = new Float32Array(starCount * 3);
    const sc2 = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      sp[i * 3] = (Math.random() - 0.5) * 200;
      sp[i * 3 + 1] = 25 + Math.random() * 70;
      sp[i * 3 + 2] = (Math.random() - 0.5) * 200;
      sc2[i] = 0.08 + Math.random() * 0.18;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    sg.setAttribute('size', new THREE.BufferAttribute(sc2, 1));
    this.scene.add(new THREE.Points(sg,
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.7, sizeAttenuation: true })
    ));
  }

  /* ═══════════════════════════════════════════
     GROUND  – layered for depth
     ═══════════════════════════════════════════ */
  private buildGround(): void {
    /* Large outer ground */
    const outer = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({ color: 0x0d1f15, roughness: 1 })
    );
    outer.rotation.x = -Math.PI / 2;
    outer.position.y = -0.05;
    outer.receiveShadow = true;
    this.scene.add(outer);

    /* Grass area */
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshStandardMaterial({ color: 0x1a3d2a, roughness: 0.85 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = -0.01;
    grass.receiveShadow = true;
    this.scene.add(grass);

    /* Central plaza – textured ring */
    const plaza = new THREE.Mesh(
      new THREE.RingGeometry(2.8, 7, 64),
      new THREE.MeshStandardMaterial({ color: 0x2a2a4a, roughness: 0.6, side: THREE.DoubleSide })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.01;
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    /* inner plaza fill */
    const inner = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 64),
      new THREE.MeshStandardMaterial({ color: 0x353560, roughness: 0.5 })
    );
    inner.rotation.x = -Math.PI / 2;
    inner.position.y = 0.015;
    inner.receiveShadow = true;
    this.scene.add(inner);

    /* Subtle grid for ground visual */
    const gridHelper = new THREE.GridHelper(80, 40, 0x1a2a20, 0x1a2a20);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.08;
    this.scene.add(gridHelper);
  }

  /* ═══════════════════════════════════════════
     ROADS
     ═══════════════════════════════════════════ */
  private buildRoads(): void {
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x252540, roughness: 0.7, metalness: 0.05 });
    const sidelineMat = new THREE.MeshBasicMaterial({ color: 0x4a4a6a, transparent: true, opacity: 0.35 });

    /* Main cross */
    for (const vertical of [false, true]) {
      const road = new THREE.Mesh(
        vertical ? new THREE.PlaneGeometry(3.5, 70) : new THREE.PlaneGeometry(70, 3.5),
        roadMat
      );
      road.rotation.x = -Math.PI / 2;
      road.position.y = 0.006;
      road.receiveShadow = true;
      this.scene.add(road);

      /* Side lines */
      for (const side of [-1, 1]) {
        const line = new THREE.Mesh(
          vertical ? new THREE.PlaneGeometry(0.06, 70) : new THREE.PlaneGeometry(70, 0.06),
          sidelineMat
        );
        line.rotation.x = -Math.PI / 2;
        line.position.y = 0.009;
        if (vertical) line.position.x = side * 1.75;
        else line.position.z = side * 1.75;
        this.scene.add(line);
      }
    }

    /* Dashed center lines */
    const dashMat = new THREE.MeshBasicMaterial({ color: 0x5a5a80, transparent: true, opacity: 0.4 });
    for (let i = -32; i <= 32; i += 2.5) {
      for (const vert of [false, true]) {
        const d = new THREE.Mesh(new THREE.PlaneGeometry(vert ? 0.1 : 1.2, vert ? 1.2 : 0.1), dashMat);
        d.rotation.x = -Math.PI / 2;
        d.position.set(vert ? 0 : i, 0.01, vert ? i : 0);
        this.scene.add(d);
      }
    }

    /* Paths to buildings */
    this.buildings.forEach(b => {
      const dx = b.position[0], dz = b.position[1];
      const len = Math.sqrt(dx * dx + dz * dz);
      if (len < 1) return;
      const road = new THREE.Mesh(new THREE.PlaneGeometry(2.2, len), roadMat);
      road.rotation.x = -Math.PI / 2;
      road.position.set(dx / 2, 0.005, dz / 2);
      road.rotation.z = -Math.atan2(dz, dx) + Math.PI / 2;
      road.receiveShadow = true;
      this.scene.add(road);
    });
  }

  /* ═══════════════════════════════════════════
     BUILDINGS
     ═══════════════════════════════════════════ */
  private buildAllBuildings(): void {
    this.buildings.forEach(b => {
      const group = new THREE.Group();
      group.position.set(b.position[0], 0, b.position[1]);

      /* Foundation */
      const foundation = new THREE.Mesh(
        new THREE.BoxGeometry(b.width + 0.6, 0.25, b.depth + 0.6),
        new THREE.MeshStandardMaterial({ color: 0x3a3a5a, roughness: 0.7 })
      );
      foundation.position.y = 0.125;
      foundation.receiveShadow = true;
      group.add(foundation);

      /* Body */
      const bodyMat = new THREE.MeshStandardMaterial({
        color: b.color, roughness: 0.45, metalness: 0.15,
        emissive: b.emissiveColor, emissiveIntensity: 0.05
      });
      const body = new THREE.Mesh(new THREE.BoxGeometry(b.width, b.height, b.depth), bodyMat);
      body.position.y = b.height / 2 + 0.25;
      body.castShadow = true; body.receiveShadow = true;
      group.add(body);

      /* Roof */
      const roofH = 1.8;
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(Math.max(b.width, b.depth) * 0.62, roofH, 4),
        new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.35, metalness: 0.25 })
      );
      roof.position.y = b.height + 0.25 + roofH / 2;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);

      /* Roof trim edge */
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(b.width + 0.3, 0.12, b.depth + 0.3),
        new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.4 })
      );
      trim.position.y = b.height + 0.25;
      group.add(trim);

      /* Windows – warm glow */
      const winMat = new THREE.MeshStandardMaterial({
        color: 0xffe8a0, emissive: 0xffcc44, emissiveIntensity: 0.9,
        transparent: true, opacity: 0.92
      });
      const wRows = Math.max(1, Math.floor(b.height / 1.6));
      const wCols = Math.max(1, Math.floor(b.width / 2));
      for (let r = 0; r < wRows; r++) {
        for (let c = 0; c < wCols; c++) {
          const wx = -b.width / 2 + 1.0 + c * 1.7;
          const wy = 1.0 + r * 1.6 + 0.25;
          /* front + back */
          for (const zSide of [1, -1]) {
            const win = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.75), winMat);
            win.position.set(wx, wy, (b.depth / 2 + 0.01) * zSide);
            if (zSide === -1) win.rotation.y = Math.PI;
            group.add(win);
          }
          /* side windows */
          for (const xSide of [1, -1]) {
            if (c < Math.floor(b.depth / 2)) {
              const winS = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.75), winMat);
              winS.position.set((b.width / 2 + 0.01) * xSide, wy, -b.depth / 2 + 1.0 + c * 1.7);
              winS.rotation.y = xSide * Math.PI / 2;
              group.add(winS);
            }
          }
        }
      }

      /* Door with frame */
      const doorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.2, 0.08),
        new THREE.MeshStandardMaterial({ color: 0x2a2a4a })
      );
      doorFrame.position.set(0, 1.35, b.depth / 2 + 0.02);
      group.add(doorFrame);
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 1.9),
        new THREE.MeshStandardMaterial({ color: 0x4a3520, emissive: 0x4a3520, emissiveIntensity: 0.15 })
      );
      door.position.set(0, 1.2, b.depth / 2 + 0.06);
      group.add(door);

      /* Door light */
      const doorLight = new THREE.PointLight(b.emissiveColor, 0.6, 6);
      doorLight.position.set(0, 2.5, b.depth / 2 + 0.5);
      group.add(doorLight);

      /* Ground glow ring */
      const glowRing = new THREE.Mesh(
        new THREE.TorusGeometry(Math.max(b.width, b.depth) * 0.52, 0.06, 8, 64),
        new THREE.MeshBasicMaterial({ color: b.emissiveColor, transparent: true, opacity: 0.25 })
      );
      glowRing.rotation.x = -Math.PI / 2;
      glowRing.position.y = 0.06;
      group.add(glowRing);

      /* Floating label sign (canvas texture) */
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 512; signCanvas.height = 96;
      const ctx = signCanvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(10,10,30,0.8)';
      ctx.roundRect(0, 0, 512, 96, 20);
      ctx.fill();
      ctx.strokeStyle = `#${b.roofColor.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = 2;
      ctx.roundRect(2, 2, 508, 92, 18);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.icon + '  ' + b.label, 256, 48);
      const signTex = new THREE.CanvasTexture(signCanvas);
      signTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(b.width * 0.95, 1.1),
        new THREE.MeshBasicMaterial({ map: signTex, transparent: true, side: THREE.DoubleSide, depthWrite: false })
      );
      sign.position.y = b.height + 3.5;
      group.add(sign);

      b.group = group;
      this.scene.add(group);
    });
  }

  /* ═══════════════════════════════════════════
     TREES – varied sizes and colors
     ═══════════════════════════════════════════ */
  private buildTrees(): void {
    const treeSpots = [
      [-6, -5], [6, -5], [-6, 5], [6, 5],
      [-20, -2], [20, -2], [-20, 2], [20, 2],
      [0, -26], [0, 26],
      [-18, -18], [18, -18], [-18, 18], [18, 18],
      [-8, -20], [8, -20], [-8, 20], [8, 20],
      [-24, -8], [24, -8], [-24, 8], [24, 8],
      [-10, 0], [10, 0], [-26, 0], [26, 0]
    ];
    const greens = [0x1a6b3c, 0x1f7a45, 0x167a3a, 0x228b44, 0x145a30];

    treeSpots.forEach(([x, z]) => {
      const h = 1.8 + Math.random() * 2;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.22, h, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 })
      );
      trunk.position.set(x, h / 2, z);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const leafColor = greens[Math.floor(Math.random() * greens.length)];
      const crownR = 0.9 + Math.random() * 0.6;
      const crown = new THREE.Mesh(
        new THREE.SphereGeometry(crownR, 12, 12),
        new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.65 })
      );
      crown.position.set(x, h + crownR * 0.5, z);
      crown.scale.y = 1.1 + Math.random() * 0.3;
      crown.castShadow = true;
      this.scene.add(crown);
    });
  }

  /* ═══════════════════════════════════════════
     LAMP POSTS – with visible light cones
     ═══════════════════════════════════════════ */
  private buildLamps(): void {
    const spots = [
      [-5, -8], [5, -8], [-5, 8], [5, 8],
      [-16, 0], [16, 0], [0, -16], [0, 16],
      [-10, -6], [10, -6], [-10, 6], [10, 6]
    ];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.8, roughness: 0.25 });

    spots.forEach(([x, z]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.8, 8), poleMat);
      pole.position.set(x, 1.9, z);
      this.scene.add(pole);

      /* arm */
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 6), poleMat);
      arm.position.set(x, 3.7, z);
      arm.rotation.z = Math.PI / 2;
      this.scene.add(arm);

      /* lamp housing */
      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.12, 0.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.6, roughness: 0.3 })
      );
      housing.position.set(x, 3.85, z);
      this.scene.add(housing);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffeebb })
      );
      bulb.position.set(x, 3.72, z);
      this.scene.add(bulb);

      const light = new THREE.PointLight(0xffe8aa, 0.5, 10, 2);
      light.position.set(x, 3.7, z);
      this.scene.add(light);

      /* ground glow circle */
      const glow = new THREE.Mesh(
        new THREE.CircleGeometry(1.2, 16),
        new THREE.MeshBasicMaterial({ color: 0xffe8aa, transparent: true, opacity: 0.06, side: THREE.DoubleSide })
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(x, 0.02, z);
      this.scene.add(glow);
    });
  }

  /* ═══════════════════════════════════════════
     FOUNTAIN
     ═══════════════════════════════════════════ */
  private buildFountain(): void {
    const stone = new THREE.MeshStandardMaterial({ color: 0x4a4a6a, roughness: 0.5, metalness: 0.25 });

    /* outer ring */
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.35, 16, 48), stone);
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.35;
    this.scene.add(outerRing);

    /* water surface */
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(2.0, 48),
      new THREE.MeshStandardMaterial({
        color: 0x3366bb, roughness: 0.05, metalness: 0.6,
        transparent: true, opacity: 0.75, emissive: 0x1144aa, emissiveIntensity: 0.15
      })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.52;
    this.scene.add(water);

    /* center column */
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 2.8, 16), stone);
    pillar.position.y = 1.9;
    this.scene.add(pillar);

    /* top ornament */
    const orn = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x818cf8, emissiveIntensity: 0.5, metalness: 0.4, roughness: 0.3 })
    );
    orn.position.y = 3.4;
    this.scene.add(orn);

    /* fountain light */
    const fLight = new THREE.PointLight(0x6688ff, 0.8, 8);
    fLight.position.set(0, 2, 0);
    this.scene.add(fLight);

    /* water particles */
    const pg = new THREE.Group();
    const pMat = new THREE.MeshBasicMaterial({ color: 0x88bbff, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 40; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), pMat);
      p.userData['vel'] = new THREE.Vector3((Math.random() - 0.5) * 1, 2.5 + Math.random() * 2, (Math.random() - 0.5) * 1);
      p.userData['life'] = Math.random();
      p.position.set(0, 3.4, 0);
      pg.add(p);
    }
    this.scene.add(pg);
    (this.scene as any).__fp = pg;
  }

  /* ═══════════════════════════════════════════
     FLOATING ORBS – ambient magic
     ═══════════════════════════════════════════ */
  private buildFloatingOrbs(): void {
    const colors = [0x6366f1, 0x8b5cf6, 0x06b6d4, 0xf59e0b, 0x10b981, 0xec4899];
    for (let i = 0; i < 18; i++) {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + Math.random() * 0.08, 12, 12),
        new THREE.MeshBasicMaterial({
          color: colors[i % colors.length], transparent: true, opacity: 0.5 + Math.random() * 0.3
        })
      );
      orb.position.set(
        (Math.random() - 0.5) * 50,
        1.5 + Math.random() * 4,
        (Math.random() - 0.5) * 50
      );
      orb.userData['baseY'] = orb.position.y;
      orb.userData['phase'] = Math.random() * Math.PI * 2;
      orb.userData['speed'] = 0.4 + Math.random() * 0.8;
      this.floatingOrbs.push(orb);
      this.scene.add(orb);
    }
  }

  /* ═══════════════════════════════════════════
     AVATAR – more detailed
     ═══════════════════════════════════════════ */
  private createAvatar(): void {
    this.avatar = new THREE.Group();

    /* Body */
    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.32, 0.65, 8, 16),
      new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.35, metalness: 0.15, emissive: 0x6366f1, emissiveIntensity: 0.08 })
    );
    body.position.y = 1.0; body.castShadow = true;
    this.avatar.add(body);

    /* Head */
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xffcc99, roughness: 0.45 })
    );
    head.position.y = 1.68; head.castShadow = true;
    this.avatar.add(head);

    /* Hair */
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.27, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: 0x3a2518, roughness: 0.8 })
    );
    hair.position.y = 1.72;
    this.avatar.add(hair);

    /* Eyes */
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a1a2e });
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
      eye.position.set(side * 0.09, 1.72, 0.21);
      this.avatar.add(eye);
    }

    /* Backpack */
    const pack = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.32, 0.18),
      new THREE.MeshStandardMaterial({ color: 0x4338ca, roughness: 0.5 })
    );
    pack.position.set(0, 1.05, -0.32);
    this.avatar.add(pack);

    /* Shadow disc */
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.5, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 })
    );
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02;
    this.avatar.add(shadow);

    /* Avatar glow light (follows the avatar) */
    this.avatarGlow = new THREE.PointLight(0x818cf8, 0.4, 6);
    this.avatarGlow.position.y = 1.5;
    this.avatar.add(this.avatarGlow);

    this.avatar.position.copy(this.avatarPos);
    this.scene.add(this.avatar);
  }

  /* ═══════════════════════════════════════════
     ANIMATION LOOP
     ═══════════════════════════════════════════ */
  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);  // cap to avoid big jumps
    const t = this.clock.getElapsedTime();

    this.updateAvatar(delta, t);
    this.updateCamera(delta);
    this.updateBuildingProximity();
    this.animateBuildings(t);
    this.animateFountain(delta);
    this.animateOrbs(t);

    this.renderer.render(this.scene, this.camera);
  };

  /* ── Avatar movement ── */
  private updateAvatar(delta: number, t: number): void {
    let dx = 0, dz = 0;

    if (this.keys['z'] || this.keys['arrowup'])    dz -= 1;
    if (this.keys['s'] || this.keys['arrowdown'])  dz += 1;
    if (this.keys['q'] || this.keys['arrowleft'])  dx -= 1;
    if (this.keys['d'] || this.keys['arrowright']) dx += 1;

    this.isMoving = dx !== 0 || dz !== 0;

    if (this.isMoving) {
      this.avatarTargetAngle = Math.atan2(dx, dz);
      const running = this.keys['shift'];
      const speed = running ? this.avatarRunSpeed : this.avatarSpeed;
      const moveX = Math.sin(this.avatarTargetAngle) * speed * delta;
      const moveZ = Math.cos(this.avatarTargetAngle) * speed * delta;

      /* try new position */
      const newX = this.avatarPos.x + moveX;
      const newZ = this.avatarPos.z + moveZ;

      /* Boundary */
      const limit = 36;
      const clampedX = Math.max(-limit, Math.min(limit, newX));
      const clampedZ = Math.max(-limit, Math.min(limit, newZ));

      /* Check collisions at new position */
      let blocked = false;

      /* Fountain collision (radius 2.6) */
      if (clampedX * clampedX + clampedZ * clampedZ < 2.6 * 2.6) {
        blocked = true;
      }

      /* Building collision */
      if (!blocked) {
        for (const b of this.buildings) {
          const bx = b.position[0], bz = b.position[1];
          const hw = b.width / 2 + 0.6, hd = b.depth / 2 + 0.6;
          if (clampedX > bx - hw && clampedX < bx + hw &&
              clampedZ > bz - hd && clampedZ < bz + hd) {
            blocked = true;
            break;
          }
        }
      }

      if (!blocked) {
        this.avatarPos.x = clampedX;
        this.avatarPos.z = clampedZ;
      }
    }

    /* Smooth rotation lerp */
    let angleDiff = this.avatarTargetAngle - this.avatarAngle;
    while (angleDiff > Math.PI)  angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.avatarAngle += angleDiff * 0.15;

    /* Apply */
    this.avatar.position.x = this.avatarPos.x;
    this.avatar.position.z = this.avatarPos.z;
    this.avatar.rotation.y = this.avatarAngle;

    /* Walking bob + tilt */
    if (this.isMoving) {
      const bobFreq = this.keys['shift'] ? 11 : 7;
      this.avatar.position.y = Math.abs(Math.sin(t * bobFreq)) * 0.12;
      this.avatar.rotation.z = Math.sin(t * bobFreq) * 0.04;
    } else {
      this.avatar.position.y = Math.sin(t * 1.5) * 0.02;  // idle breathe
      this.avatar.rotation.z *= 0.9; // settle tilt back
    }

    /* Avatar glow intensity while moving */
    if (this.avatarGlow) {
      this.avatarGlow.intensity = this.isMoving ? 0.5 + Math.sin(t * 4) * 0.15 : 0.3;
    }
  }

  /* ── Smooth camera follow ── */
  private updateCamera(delta: number): void {
    const target = new THREE.Vector3(this.avatarPos.x, 0, this.avatarPos.z);
    const desiredPos = target.clone().add(this.camOffset);
    this.camera.position.lerp(desiredPos, 1 - Math.pow(0.001, delta));
    this.camera.lookAt(target.clone().add(this.camLookOffset));
  }

  /* ── Building proximity ── */
  private updateBuildingProximity(): void {
    let closest: BuildingInfo | null = null;
    let closestDist = Infinity;

    for (const b of this.buildings) {
      const dist = Math.hypot(this.avatarPos.x - b.position[0], this.avatarPos.z - b.position[1]);
      if (dist < closestDist) { closestDist = dist; closest = b; }
    }

    const range = 6;
    this.ngZone.run(() => {
      if (closest && closestDist < range) {
        this.nearBuilding = closest;
        this.interactPrompt = true;
      } else {
        this.nearBuilding = null;
        this.interactPrompt = false;
      }
    });

    /* Highlight near building */
    this.buildings.forEach(b => {
      if (!b.group) return;
      const isNear = b === this.nearBuilding;
      const body = b.group.children[1] as THREE.Mesh;
      if (body?.material) {
        (body.material as THREE.MeshStandardMaterial).emissiveIntensity = isNear ? 0.2 : 0.05;
      }
    });
  }

  /* ── Building animations ── */
  private animateBuildings(t: number): void {
    this.buildings.forEach((b, i) => {
      if (!b.group) return;
      /* Subtle hover */
      b.group.position.y = Math.sin(t * 0.6 + i * 1.2) * 0.04;

      /* Glow ring pulse */
      b.group.children.forEach(c => {
        if (c instanceof THREE.Mesh && (c as THREE.Mesh).geometry instanceof THREE.TorusGeometry) {
          (c.material as THREE.MeshBasicMaterial).opacity = 0.15 + Math.sin(t * 1.8 + i) * 0.12;
        }
      });

      /* Billboard */
      const sign = b.group.children[b.group.children.length - 1];
      if (sign) sign.lookAt(this.camera.position);
    });
  }

  /* ── Fountain particles ── */
  private animateFountain(delta: number): void {
    const pg = (this.scene as any).__fp as THREE.Group;
    if (!pg) return;
    pg.children.forEach((p: THREE.Object3D) => {
      const m = p as THREE.Mesh;
      m.userData['life'] += delta;
      if (m.userData['life'] > 1.3) {
        m.userData['life'] = 0;
        m.position.set(0, 3.4, 0);
        m.userData['vel'] = new THREE.Vector3((Math.random() - 0.5) * 1, 2.5 + Math.random() * 2, (Math.random() - 0.5) * 1);
      }
      const v = m.userData['vel'] as THREE.Vector3;
      v.y -= 5.5 * delta;
      m.position.add(v.clone().multiplyScalar(delta));
    });
  }

  /* ── Floating orbs ── */
  private animateOrbs(t: number): void {
    this.floatingOrbs.forEach(o => {
      o.position.y = o.userData['baseY'] + Math.sin(t * o.userData['speed'] + o.userData['phase']) * 0.8;
      o.position.x += Math.sin(t * 0.3 + o.userData['phase']) * 0.003;
    });
  }

  /* ═══════════════════════════════════════════
     INPUT
     ═══════════════════════════════════════════ */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    this.keys[key] = true;
    /* prevent page scroll for movement keys */
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault();
    }
    if ((key === 'e' || e.key === 'Enter') && this.nearBuilding) {
      this.ngZone.run(() => { this.router.navigate([this.nearBuilding!.route]); });
    }
  }

  @HostListener('window:keyup', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    this.keys[e.key.toLowerCase()] = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    const c = this.canvasRef.nativeElement;
    const w = c.clientWidth || window.innerWidth;
    const h = c.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /* ═══════════════════════════════════════════
     PUBLIC
     ═══════════════════════════════════════════ */
  navigateTo(route: string): void { this.router.navigate([route]); }
  goHome(): void { this.router.navigate(['/']); }
  interact(): void { if (this.nearBuilding) this.router.navigate([this.nearBuilding.route]); }
}

