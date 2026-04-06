import {
  Component, OnInit, OnDestroy, ElementRef, ViewChild,
  AfterViewInit, NgZone, HostListener
} from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { LibraryService, Product } from '../../core/services/library.service';
import { CartService, Cart } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

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

  /* ── Library browser ── */
  showLibraryBrowser = false;
  libraryProducts: Product[] = [];
  libraryLoading = false;
  libraryView: 'browse' | 'cart' = 'browse';

  /* ── Cart ── */
  cart: Cart | null = null;
  cartLoading = false;
  checkoutLoading = false;
  checkoutSuccess = false;
  userId: number | null = null;
  addingToCart = new Set<number>();

  /* ── Three.js core ── */
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private animFrameId = 0;

  /* ── Avatar ── */
  private avatar!: THREE.Group;
  private avatarPos = new THREE.Vector3(0, 0, 10);
  private avatarAngle = 0;
  private avatarTargetAngle = 0;
  private readonly WALK_SPEED = 14;
  private readonly RUN_SPEED = 24;
  private isMoving = false;
  private walkCycle = 0;
  private leftLeg!: THREE.Group;
  private rightLeg!: THREE.Group;
  private leftArm!: THREE.Group;
  private rightArm!: THREE.Group;

  /* ── Camera orbit ── */
  private cameraTheta = 0;
  private cameraPhi = 0.5;
  private cameraDistance = 25;
  private isDragging = false;
  private prevMouseX = 0;
  private prevMouseY = 0;

  /* ── Input ── */
  private keys: Record<string, boolean> = {};

  /* ── Scene objects ── */
  private floatingOrbs: THREE.Mesh[] = [];
  private clouds: THREE.Group[] = [];
  private fountainParticles!: THREE.Group;
  private glowRings: { mesh: THREE.Mesh; buildingIndex: number }[] = [];

  /* ── Buildings ── */
  buildings: BuildingInfo[] = [
    {
      label: 'Courses Academy', icon: '📚',
      description: 'Browse expert-led programming courses',
      route: '/front/courses',
      color: 0x4361ee, roofColor: 0x7B93FF, emissiveColor: 0x4361ee,
      position: [-28, -24], width: 8, depth: 7, height: 6
    },
    {
      label: 'Digital Library', icon: '📖',
      description: 'Explore the digital book collection',
      route: '/front/library',
      color: 0x7209b7, roofColor: 0xB47FDB, emissiveColor: 0x9B59B6,
      position: [28, -24], width: 8, depth: 7, height: 7
    },
    {
      label: 'Learner Dashboard', icon: '📊',
      description: 'Track your learning progress',
      route: '/dashboardLearner',
      color: 0x0096c7, roofColor: 0x48CAE4, emissiveColor: 0x00B4D8,
      position: [-28, 24], width: 7, depth: 6.5, height: 5
    },
    {
      label: 'Services Center', icon: '⚙️',
      description: 'Discover platform services & tools',
      route: '/services',
      color: 0xe85d04, roofColor: 0xFAA307, emissiveColor: 0xF48C06,
      position: [28, 24], width: 7, depth: 6.5, height: 5.5
    },
    {
      label: 'Info Tower', icon: 'ℹ️',
      description: 'Learn about the Aletheia platform',
      route: '/about',
      color: 0x2d6a4f, roofColor: 0x52B788, emissiveColor: 0x40916C,
      position: [0, -38], width: 6, depth: 6, height: 9
    },
    {
      label: 'Community Hub', icon: '👥',
      description: 'Connect with fellow learners',
      route: '/contact',
      color: 0xd62828, roofColor: 0xF77F7F, emissiveColor: 0xE63946,
      position: [0, 38], width: 7, depth: 6, height: 5
    }
  ];

  constructor(
    private ngZone: NgZone,
    private router: Router,
    private libraryService: LibraryService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userId = user.id;
      this.loadCart();
    }
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initScene();
      this.buildSkyDome();
      this.buildGround();
      this.buildRoads();
      this.buildAllBuildings();
      this.buildGlowRings();
      this.buildTrees();
      this.buildLamps();
      this.buildFountain();
      this.buildClouds();
      this.buildFloatingOrbs();
      this.createAvatar();
      this.setupMouseControls();
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
     SCENE – bright daytime campus
     ═══════════════════════════════════════════ */
  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    this.scene = new THREE.Scene();
    this.scene.background = null; // sky dome handles background
    this.scene.fog = new THREE.FogExp2(0xB0D8F0, 0.004);

    this.camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 300);

    /* Ambient */
    this.scene.add(new THREE.AmbientLight(0xfff8e7, 0.6));

    /* Hemisphere: rich sky blue top, warm ground bottom */
    this.scene.add(new THREE.HemisphereLight(0x5B9BD5, 0x7DAF5A, 0.8));

    /* Sun — golden hour angle */
    const sun = new THREE.DirectionalLight(0xFFF4CC, 1.4);
    sun.position.set(40, 60, 25);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -70; sc.right = 70; sc.top = 70; sc.bottom = -70;
    sc.near = 1; sc.far = 140;
    this.scene.add(sun);

    /* Soft cool fill from opposite side */
    const fill = new THREE.DirectionalLight(0x90C8FF, 0.45);
    fill.position.set(-40, 25, -25);
    this.scene.add(fill);

    /* Warm accent from below */
    const bounce = new THREE.DirectionalLight(0xFFE4B0, 0.2);
    bounce.position.set(0, -10, 0);
    this.scene.add(bounce);
  }

  /* ═══════════════════════════════════════════
     GROUND
     ═══════════════════════════════════════════ */
  private buildGround(): void {
    /* Main grass */
    const grass = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshStandardMaterial({ color: 0x5B8C3E, roughness: 0.85 })
    );
    grass.rotation.x = -Math.PI / 2;
    grass.receiveShadow = true;
    this.scene.add(grass);

    /* Central plaza */
    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(10, 64),
      new THREE.MeshStandardMaterial({ color: 0xC4B79A, roughness: 0.6 })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.01;
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    /* Plaza brick border */
    const border = new THREE.Mesh(
      new THREE.RingGeometry(9.5, 10.5, 64),
      new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.5 })
    );
    border.rotation.x = -Math.PI / 2;
    border.position.y = 0.015;
    this.scene.add(border);

    /* Flower beds around plaza */
    const flowerColors = [0xFF6B9D, 0xFFD93D, 0xC084FC, 0xFF8A65];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 11.5;
      const bed = new THREE.Mesh(
        new THREE.CircleGeometry(1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x3D6B2E, roughness: 0.9 })
      );
      bed.rotation.x = -Math.PI / 2;
      bed.position.set(Math.cos(angle) * r, 0.02, Math.sin(angle) * r);
      this.scene.add(bed);

      for (let j = 0; j < 5; j++) {
        const flower = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 6, 6),
          new THREE.MeshStandardMaterial({ color: flowerColors[(i + j) % flowerColors.length], roughness: 0.6 })
        );
        flower.position.set(
          Math.cos(angle) * r + (Math.random() - 0.5) * 1.5,
          0.15,
          Math.sin(angle) * r + (Math.random() - 0.5) * 1.5
        );
        this.scene.add(flower);
      }
    }
  }

  /* ═══════════════════════════════════════════
     ROADS – wide, clearly visible
     ═══════════════════════════════════════════ */
  private buildRoads(): void {
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x707070, roughness: 0.85, metalness: 0.02 });
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xBBBBAA, roughness: 0.7 });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const yellowMat = new THREE.MeshBasicMaterial({ color: 0xF4D03F });

    /* Main cross roads */
    for (const vertical of [false, true]) {
      const road = new THREE.Mesh(
        vertical ? new THREE.PlaneGeometry(6, 130) : new THREE.PlaneGeometry(130, 6),
        roadMat
      );
      road.rotation.x = -Math.PI / 2;
      road.position.y = 0.02;
      road.receiveShadow = true;
      this.scene.add(road);

      /* Sidewalks */
      for (const side of [-1, 1]) {
        const sw = new THREE.Mesh(
          vertical ? new THREE.PlaneGeometry(1.5, 130) : new THREE.PlaneGeometry(130, 1.5),
          sidewalkMat
        );
        sw.rotation.x = -Math.PI / 2;
        sw.position.y = 0.025;
        if (vertical) sw.position.x = side * 3.75;
        else sw.position.z = side * 3.75;
        sw.receiveShadow = true;
        this.scene.add(sw);
      }

      /* Yellow edge lines */
      for (const side of [-1, 1]) {
        const el = new THREE.Mesh(
          vertical ? new THREE.PlaneGeometry(0.15, 130) : new THREE.PlaneGeometry(130, 0.15),
          yellowMat
        );
        el.rotation.x = -Math.PI / 2;
        el.position.y = 0.03;
        if (vertical) el.position.x = side * 2.9;
        else el.position.z = side * 2.9;
        this.scene.add(el);
      }

      /* White dashed center line */
      for (let i = -60; i <= 60; i += 3.5) {
        const dash = new THREE.Mesh(
          new THREE.PlaneGeometry(vertical ? 0.18 : 2.0, vertical ? 2.0 : 0.18),
          whiteMat
        );
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(vertical ? 0 : i, 0.035, vertical ? i : 0);
        this.scene.add(dash);
      }
    }

    /* Paths from plaza to each building */
    this.buildings.forEach(b => {
      const dx = b.position[0], dz = b.position[1];
      const len = Math.sqrt(dx * dx + dz * dz);
      if (len < 1) return;

      const path = new THREE.Mesh(new THREE.PlaneGeometry(4, len), roadMat);
      path.rotation.x = -Math.PI / 2;
      path.position.set(dx / 2, 0.02, dz / 2);
      path.rotation.z = -Math.atan2(dz, dx) + Math.PI / 2;
      path.receiveShadow = true;
      this.scene.add(path);

      /* Path sidewalks */
      for (const side of [-1, 1]) {
        const psw = new THREE.Mesh(new THREE.PlaneGeometry(1.0, len), sidewalkMat);
        psw.rotation.x = -Math.PI / 2;
        const perpX = -dz / len;
        const perpZ = dx / len;
        psw.position.set(dx / 2 + perpX * side * 2.5, 0.025, dz / 2 + perpZ * side * 2.5);
        psw.rotation.z = -Math.atan2(dz, dx) + Math.PI / 2;
        psw.receiveShadow = true;
        this.scene.add(psw);
      }
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
        new THREE.BoxGeometry(b.width + 1, 0.3, b.depth + 1),
        new THREE.MeshStandardMaterial({ color: 0x9E9E8E, roughness: 0.7 })
      );
      foundation.position.y = 0.15;
      foundation.receiveShadow = true;
      foundation.castShadow = true;
      group.add(foundation);

      /* Body */
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(b.width, b.height, b.depth),
        new THREE.MeshStandardMaterial({
          color: b.color, roughness: 0.4, metalness: 0.1,
          emissive: b.emissiveColor, emissiveIntensity: 0.03
        })
      );
      body.position.y = b.height / 2 + 0.3;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      /* Roof */
      const roofH = 2.0;
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(Math.max(b.width, b.depth) * 0.65, roofH, 4),
        new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.35, metalness: 0.2 })
      );
      roof.position.y = b.height + 0.3 + roofH / 2;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      group.add(roof);

      /* Roof trim */
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(b.width + 0.4, 0.15, b.depth + 0.4),
        new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.4 })
      );
      trim.position.y = b.height + 0.3;
      group.add(trim);

      /* Windows */
      const winMat = new THREE.MeshStandardMaterial({
        color: 0xADD8E6, emissive: 0x88BBDD, emissiveIntensity: 0.15,
        transparent: true, opacity: 0.8, metalness: 0.3, roughness: 0.1
      });
      const frameMat = new THREE.MeshStandardMaterial({ color: 0xEEEEEE, roughness: 0.5 });
      const wRows = Math.max(1, Math.floor(b.height / 1.8));
      const wCols = Math.max(1, Math.floor(b.width / 2.2));
      for (let r = 0; r < wRows; r++) {
        for (let c = 0; c < wCols; c++) {
          const wx = -b.width / 2 + 1.1 + c * 2.0;
          const wy = 1.2 + r * 1.8 + 0.3;
          for (const zSide of [1, -1]) {
            const frame = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 1.02), frameMat);
            frame.position.set(wx, wy, (b.depth / 2 + 0.005) * zSide);
            if (zSide === -1) frame.rotation.y = Math.PI;
            group.add(frame);
            const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), winMat);
            win.position.set(wx, wy, (b.depth / 2 + 0.01) * zSide);
            if (zSide === -1) win.rotation.y = Math.PI;
            group.add(win);
          }
          for (const xSide of [1, -1]) {
            if (c < Math.floor(b.depth / 2.2)) {
              const winS = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.9), winMat);
              winS.position.set((b.width / 2 + 0.01) * xSide, wy, -b.depth / 2 + 1.1 + c * 2.0);
              winS.rotation.y = xSide * Math.PI / 2;
              group.add(winS);
            }
          }
        }
      }

      /* Door */
      const doorFrame = new THREE.Mesh(
        new THREE.BoxGeometry(1.6, 2.4, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x8B7355 })
      );
      doorFrame.position.set(0, 1.5, b.depth / 2 + 0.02);
      group.add(doorFrame);
      const door = new THREE.Mesh(
        new THREE.PlaneGeometry(1.3, 2.1),
        new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.6 })
      );
      door.position.set(0, 1.38, b.depth / 2 + 0.07);
      group.add(door);

      /* Door awning */
      const awning = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.08, 1.0),
        new THREE.MeshStandardMaterial({ color: b.roofColor, roughness: 0.4 })
      );
      awning.position.set(0, 2.8, b.depth / 2 + 0.5);
      awning.castShadow = true;
      group.add(awning);

      /* Floating label sign */
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 512; signCanvas.height = 96;
      const ctx = signCanvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.roundRect(0, 0, 512, 96, 16);
      ctx.fill();
      ctx.strokeStyle = `#${b.color.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = 3;
      ctx.roundRect(3, 3, 506, 90, 14);
      ctx.stroke();
      ctx.fillStyle = `#${b.color.toString(16).padStart(6, '0')}`;
      ctx.font = 'bold 30px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.icon + '  ' + b.label, 256, 48);
      const signTex = new THREE.CanvasTexture(signCanvas);
      signTex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      const sign = new THREE.Mesh(
        new THREE.PlaneGeometry(b.width * 0.95, 1.1),
        new THREE.MeshBasicMaterial({ map: signTex, transparent: true, side: THREE.DoubleSide, depthWrite: false })
      );
      sign.position.y = b.height + 4;
      group.add(sign);

      b.group = group;
      this.scene.add(group);
    });
  }

  /* ═══════════════════════════════════════════
     TREES
     ═══════════════════════════════════════════ */
  private buildTrees(): void {
    const treeSpots = [
      [-8, -8], [8, -8], [-8, 8], [8, 8],
      [-16, 0], [16, 0], [0, -16], [0, 16],
      [-20, -12], [20, -12], [-20, 12], [20, 12],
      [-12, -20], [12, -20], [-12, 20], [12, 20],
      [-36, -36], [36, -36], [-36, 36], [36, 36],
      [-36, 0], [36, 0], [0, -48], [0, 48],
      [-22, -18], [22, -18], [-22, 18], [22, 18],
      [-42, -12], [42, -12], [-42, 12], [42, 12],
      [-14, -36], [14, -36], [-14, 36], [14, 36],
      [-6, -30], [6, -30], [-6, 30], [6, 30],
    ];
    const greens = [0x3D8B37, 0x4A9E44, 0x2E7D32, 0x66BB6A, 0x388E3C];
    const darkGreens = [0x1B5E20, 0x2E7D32, 0x33691E];

    treeSpots.forEach(([x, z], idx) => {
      const isPine = idx % 4 === 0;
      const h = isPine ? 3 + Math.random() * 2 : 2 + Math.random() * 1.5;

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.2, h, 8),
        new THREE.MeshStandardMaterial({ color: 0x6D4C2A, roughness: 0.9 })
      );
      trunk.position.set(x, h / 2, z);
      trunk.castShadow = true;
      this.scene.add(trunk);

      if (isPine) {
        const pineColor = darkGreens[Math.floor(Math.random() * darkGreens.length)];
        for (let layer = 0; layer < 3; layer++) {
          const coneR = 1.5 - layer * 0.35;
          const coneH = 1.8 - layer * 0.3;
          const cone = new THREE.Mesh(
            new THREE.ConeGeometry(coneR, coneH, 8),
            new THREE.MeshStandardMaterial({ color: pineColor, roughness: 0.7 })
          );
          cone.position.set(x, h + 0.5 + layer, z);
          cone.castShadow = true;
          this.scene.add(cone);
        }
      } else {
        const leafColor = greens[Math.floor(Math.random() * greens.length)];
        const crownR = 1.0 + Math.random() * 0.5;
        const crown = new THREE.Mesh(
          new THREE.SphereGeometry(crownR, 10, 10),
          new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.65 })
        );
        crown.position.set(x, h + crownR * 0.6, z);
        crown.scale.y = 1.1 + Math.random() * 0.3;
        crown.castShadow = true;
        this.scene.add(crown);
      }

      /* Tree shadow on ground */
      const tShadow = new THREE.Mesh(
        new THREE.CircleGeometry(1.2, 12),
        new THREE.MeshBasicMaterial({ color: 0x2E5528, transparent: true, opacity: 0.15 })
      );
      tShadow.rotation.x = -Math.PI / 2;
      tShadow.position.set(x, 0.01, z);
      this.scene.add(tShadow);
    });
  }

  /* ═══════════════════════════════════════════
     LAMP POSTS
     ═══════════════════════════════════════════ */
  private buildLamps(): void {
    const spots = [
      [-8, -14], [8, -14], [-8, 14], [8, 14],
      [-22, 0], [22, 0], [0, -22], [0, 22],
      [-14, -8], [14, -8], [-14, 8], [14, 8],
      [-30, -24], [30, -24], [-30, 24], [30, 24],
      [0, -32], [0, 32],
    ];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x5C5C5C, metalness: 0.7, roughness: 0.3 });

    spots.forEach(([x, z]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 4.2, 8), poleMat);
      pole.position.set(x, 2.1, z);
      pole.castShadow = true;
      this.scene.add(pole);

      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6), poleMat);
      arm.position.set(x, 4.1, z);
      arm.rotation.z = Math.PI / 2;
      this.scene.add(arm);

      const housing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.15, 0.22, 8),
        new THREE.MeshStandardMaterial({ color: 0x404040, metalness: 0.5, roughness: 0.3 })
      );
      housing.position.set(x, 4.3, z);
      this.scene.add(housing);

      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 10, 10),
        new THREE.MeshStandardMaterial({ color: 0xFFF8DC, emissive: 0xFFF8DC, emissiveIntensity: 0.3 })
      );
      bulb.position.set(x, 4.15, z);
      this.scene.add(bulb);
    });
  }

  /* ══════════════════════════════════════��════
     FOUNTAIN
     ═══════════════════════════════════════════ */
  private buildFountain(): void {
    const stone = new THREE.MeshStandardMaterial({ color: 0x9E9E8E, roughness: 0.5, metalness: 0.15 });

    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.5, 32), stone);
    base.position.y = 0.25;
    base.castShadow = true;
    this.scene.add(base);

    const water = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 48),
      new THREE.MeshStandardMaterial({
        color: 0x4FC3F7, roughness: 0.05, metalness: 0.4,
        transparent: true, opacity: 0.7
      })
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.52;
    this.scene.add(water);

    const wall = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.2, 12, 48), stone);
    wall.rotation.x = -Math.PI / 2;
    wall.position.y = 0.55;
    this.scene.add(wall);

    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 3, 16), stone);
    pillar.position.y = 2;
    pillar.castShadow = true;
    this.scene.add(pillar);

    const orn = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.6, roughness: 0.2 })
    );
    orn.position.y = 3.6;
    this.scene.add(orn);

    /* Fountain glow light */
    const fountainLight = new THREE.PointLight(0x4FC3F7, 1.8, 14);
    fountainLight.position.set(0, 3.5, 0);
    this.scene.add(fountainLight);

    this.fountainParticles = new THREE.Group();
    const pMat = new THREE.MeshBasicMaterial({ color: 0x81D4FA, transparent: true, opacity: 0.75 });
    for (let i = 0; i < 40; i++) {
      const p = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 6), pMat);
      p.userData['vel'] = new THREE.Vector3((Math.random() - 0.5) * 0.8, 2 + Math.random() * 2, (Math.random() - 0.5) * 0.8);
      p.userData['life'] = Math.random();
      p.position.set(0, 3.6, 0);
      this.fountainParticles.add(p);
    }
    this.scene.add(this.fountainParticles);
  }

  /* ═══════════════════════════════════════════
     CLOUDS
     ═══════════════════════════════════════════ */
  private buildClouds(): void {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF, roughness: 1, metalness: 0,
      transparent: true, opacity: 0.85
    });

    for (let i = 0; i < 14; i++) {
      const cloud = new THREE.Group();
      const numPuffs = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < numPuffs; j++) {
        const puff = new THREE.Mesh(
          new THREE.SphereGeometry(2.5 + Math.random() * 3, 8, 6),
          cloudMat
        );
        puff.position.set((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 1.2, (Math.random() - 0.5) * 3);
        puff.scale.y = 0.45 + Math.random() * 0.2;
        cloud.add(puff);
      }
      cloud.position.set(
        (Math.random() - 0.5) * 180,
        32 + Math.random() * 18,
        (Math.random() - 0.5) * 180
      );
      cloud.userData['speed'] = 0.3 + Math.random() * 0.6;
      this.clouds.push(cloud);
      this.scene.add(cloud);
    }
  }

  /* ═══════════════════════════════════════════
     FLOATING ORBS
     ═══════════════════════════════════════════ */
  private buildFloatingOrbs(): void {
    const colors = [0xFFD700, 0xFF69B4, 0x7EB8FF, 0x98FB98, 0xDDA0DD, 0xFFA07A, 0xFF6B6B, 0x4ECDC4];
    for (let i = 0; i < 35; i++) {
      const size = 0.12 + Math.random() * 0.14;
      const color = colors[i % colors.length];
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(size, 10, 10),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.6 + Math.random() * 0.4,
          transparent: true,
          opacity: 0.75 + Math.random() * 0.2,
          roughness: 0.1,
          metalness: 0.3
        })
      );
      orb.position.set(
        (Math.random() - 0.5) * 70,
        1.0 + Math.random() * 4,
        (Math.random() - 0.5) * 70
      );
      orb.userData['baseY'] = orb.position.y;
      orb.userData['phase'] = Math.random() * Math.PI * 2;
      orb.userData['speed'] = 0.4 + Math.random() * 0.8;
      this.floatingOrbs.push(orb);
      this.scene.add(orb);
    }
  }

  /* ═══════════════════════════════════════════
     AVATAR – student with backpack
     ═══════════════════════════════════════════ */
  private createAvatar(): void {
    this.avatar = new THREE.Group();

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC99, roughness: 0.6 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xF0F0F0, roughness: 0.5 });
    const jeansMat = new THREE.MeshStandardMaterial({ color: 0x2C3E6B, roughness: 0.7 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x3A2518, roughness: 0.8 });
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7 });
    const backpackMat = new THREE.MeshStandardMaterial({ color: 0xE74C3C, roughness: 0.5 });
    const strapMat = new THREE.MeshStandardMaterial({ color: 0xC0392B, roughness: 0.5 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1A1A2E });

    /* Torso (white T-shirt) */
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 0.3), shirtMat);
    torso.position.y = 1.1;
    torso.castShadow = true;
    this.avatar.add(torso);

    /* Head */
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMat);
    head.position.y = 1.58;
    head.castShadow = true;
    this.avatar.add(head);

    /* Hair */
    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      hairMat
    );
    hair.position.y = 1.62;
    this.avatar.add(hair);

    /* Eyes (front = +Z direction in local space) */
    for (const side of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), eyeMat);
      eye.position.set(side * 0.08, 1.6, 0.18);
      this.avatar.add(eye);
    }

    /* Left Arm (pivots from shoulder) */
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.35, 1.3, 0);
    const lArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.4, 4, 8), skinMat);
    lArmMesh.position.y = -0.26;
    lArmMesh.castShadow = true;
    this.leftArm.add(lArmMesh);
    this.avatar.add(this.leftArm);

    /* Right Arm */
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.35, 1.3, 0);
    const rArmMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, 0.4, 4, 8), skinMat);
    rArmMesh.position.y = -0.26;
    rArmMesh.castShadow = true;
    this.rightArm.add(rArmMesh);
    this.avatar.add(this.rightArm);

    /* Left Leg (pivots from hip) */
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.13, 0.8, 0);
    const lLegMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.42, 4, 8), jeansMat);
    lLegMesh.position.y = -0.26;
    lLegMesh.castShadow = true;
    this.leftLeg.add(lLegMesh);
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.22), shoeMat);
    lShoe.position.set(0, -0.52, 0.03);
    this.leftLeg.add(lShoe);
    this.avatar.add(this.leftLeg);

    /* Right Leg */
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.13, 0.8, 0);
    const rLegMesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.42, 4, 8), jeansMat);
    rLegMesh.position.y = -0.26;
    rLegMesh.castShadow = true;
    this.rightLeg.add(rLegMesh);
    const rShoe = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.07, 0.22), shoeMat);
    rShoe.position.set(0, -0.52, 0.03);
    this.rightLeg.add(rShoe);
    this.avatar.add(this.rightLeg);

    /* Backpack (on back, -Z side) */
    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.22), backpackMat);
    backpack.position.set(0, 1.08, -0.26);
    backpack.castShadow = true;
    this.avatar.add(backpack);

    /* Backpack straps */
    for (const side of [-1, 1]) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.36, 0.04), strapMat);
      strap.position.set(side * 0.16, 1.15, -0.13);
      this.avatar.add(strap);
    }

    /* Backpack pocket */
    const pocket = new THREE.Mesh(
      new THREE.BoxGeometry(0.28, 0.18, 0.04),
      new THREE.MeshStandardMaterial({ color: 0xC0392B, roughness: 0.5 })
    );
    pocket.position.set(0, 0.95, -0.38);
    this.avatar.add(pocket);

    /* Shadow disc */
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.45, 24),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.02;
    this.avatar.add(shadow);

    this.avatar.position.copy(this.avatarPos);
    this.scene.add(this.avatar);
  }

  /* ═══════════════════════════════════════════
     MOUSE CONTROLS – orbit camera
     ═══════════════════════════════════════════ */
  private setupMouseControls(): void {
    const canvas = this.canvasRef.nativeElement;

    canvas.addEventListener('mousedown', (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        this.isDragging = true;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
    });

    canvas.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging || this.showLibraryBrowser) return;
      const dx = e.clientX - this.prevMouseX;
      const dy = e.clientY - this.prevMouseY;
      this.cameraTheta -= dx * 0.005;
      this.cameraPhi = Math.max(0.1, Math.min(1.3, this.cameraPhi + dy * 0.005));
      this.prevMouseX = e.clientX;
      this.prevMouseY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => { this.isDragging = false; });
    canvas.addEventListener('mouseleave', () => { this.isDragging = false; });

    canvas.addEventListener('wheel', (e: WheelEvent) => {
      if (this.showLibraryBrowser) return;
      e.preventDefault();
      this.cameraDistance = Math.max(10, Math.min(50, this.cameraDistance + e.deltaY * 0.03));
    }, { passive: false });

    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /* ═══════════════════════════════════════════
     ANIMATION LOOP
     ═══════════════════════════════════════════ */
  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.getElapsedTime();

    if (!this.showLibraryBrowser) {
      this.updateAvatar(delta);
    }
    this.updateCamera(delta);
    this.updateBuildingProximity();
    this.animateBuildings(t);
    this.animateFountain(delta);
    this.animateOrbs(t);
    this.animateClouds(delta);
    this.animateGlowRings(t);

    this.renderer.render(this.scene, this.camera);
  };

  /* ── Avatar movement (camera-relative) ── */
  private updateAvatar(delta: number): void {
    const fwdX = -Math.sin(this.cameraTheta);
    const fwdZ = -Math.cos(this.cameraTheta);
    const rightX = Math.cos(this.cameraTheta);
    const rightZ = -Math.sin(this.cameraTheta);

    let moveX = 0, moveZ = 0;
    if (this.keys['w'] || this.keys['z'] || this.keys['arrowup'])    { moveX += fwdX; moveZ += fwdZ; }
    if (this.keys['s'] || this.keys['arrowdown'])                     { moveX -= fwdX; moveZ -= fwdZ; }
    if (this.keys['d'] || this.keys['arrowright'])                    { moveX += rightX; moveZ += rightZ; }
    if (this.keys['a'] || this.keys['q'] || this.keys['arrowleft'])  { moveX -= rightX; moveZ -= rightZ; }

    this.isMoving = moveX !== 0 || moveZ !== 0;

    if (this.isMoving) {
      const len = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= len; moveZ /= len;

      this.avatarTargetAngle = Math.atan2(moveX, moveZ);

      const running = this.keys['shift'];
      const speed = running ? this.RUN_SPEED : this.WALK_SPEED;
      const newX = this.avatarPos.x + moveX * speed * delta;
      const newZ = this.avatarPos.z + moveZ * speed * delta;

      const limit = 60;
      const clampedX = Math.max(-limit, Math.min(limit, newX));
      const clampedZ = Math.max(-limit, Math.min(limit, newZ));

      let blocked = false;
      if (clampedX * clampedX + clampedZ * clampedZ < 4 * 4) blocked = true;
      if (!blocked) {
        for (const b of this.buildings) {
          const bx = b.position[0], bz = b.position[1];
          const hw = b.width / 2 + 0.8, hd = b.depth / 2 + 0.8;
          if (clampedX > bx - hw && clampedX < bx + hw &&
              clampedZ > bz - hd && clampedZ < bz + hd) {
            blocked = true; break;
          }
        }
      }

      if (!blocked) {
        this.avatarPos.x = clampedX;
        this.avatarPos.z = clampedZ;
      }

      /* Walking animation */
      const animSpeed = this.keys['shift'] ? 12 : 8;
      this.walkCycle += delta * animSpeed;
      const swing = Math.sin(this.walkCycle) * 0.55;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.5;
      this.rightArm.rotation.x = swing * 0.5;

      this.avatar.position.y = Math.abs(Math.sin(this.walkCycle * 2)) * 0.04;
    } else {
      this.leftLeg.rotation.x *= 0.85;
      this.rightLeg.rotation.x *= 0.85;
      this.leftArm.rotation.x *= 0.85;
      this.rightArm.rotation.x *= 0.85;
      this.avatar.position.y *= 0.9;
    }

    /* Smooth rotation lerp */
    let angleDiff = this.avatarTargetAngle - this.avatarAngle;
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    this.avatarAngle += angleDiff * 0.18;

    this.avatar.position.x = this.avatarPos.x;
    this.avatar.position.z = this.avatarPos.z;
    this.avatar.rotation.y = this.avatarAngle;
  }

  /* ── Camera orbit follow ── */
  private updateCamera(delta: number): void {
    const target = new THREE.Vector3(this.avatarPos.x, 1.2, this.avatarPos.z);
    const camX = target.x + this.cameraDistance * Math.sin(this.cameraTheta) * Math.cos(this.cameraPhi);
    const camY = target.y + this.cameraDistance * Math.sin(this.cameraPhi);
    const camZ = target.z + this.cameraDistance * Math.cos(this.cameraTheta) * Math.cos(this.cameraPhi);

    const desired = new THREE.Vector3(camX, camY, camZ);
    this.camera.position.lerp(desired, 1 - Math.pow(0.005, delta));
    this.camera.lookAt(target);
  }

  /* ── Building proximity ── */
  private updateBuildingProximity(): void {
    let closest: BuildingInfo | null = null;
    let closestDist = Infinity;

    for (const b of this.buildings) {
      const dist = Math.hypot(this.avatarPos.x - b.position[0], this.avatarPos.z - b.position[1]);
      if (dist < closestDist) { closestDist = dist; closest = b; }
    }

    const range = 7;
    this.ngZone.run(() => {
      if (closest && closestDist < range) {
        this.nearBuilding = closest;
        this.interactPrompt = true;
      } else {
        this.nearBuilding = null;
        this.interactPrompt = false;
      }
    });

    this.buildings.forEach(b => {
      if (!b.group) return;
      const isNear = b === this.nearBuilding;
      const body = b.group.children[1] as THREE.Mesh;
      if (body?.material) {
        (body.material as THREE.MeshStandardMaterial).emissiveIntensity = isNear ? 0.15 : 0.03;
      }
    });
  }

  /* ── Building animations ── */
  private animateBuildings(t: number): void {
    this.buildings.forEach((b, i) => {
      if (!b.group) return;
      b.group.position.y = Math.sin(t * 0.4 + i * 1.2) * 0.02;
      const sign = b.group.children[b.group.children.length - 1];
      if (sign) sign.lookAt(this.camera.position);
    });
  }

  /* ── Fountain particles ── */
  private animateFountain(delta: number): void {
    if (!this.fountainParticles) return;
    this.fountainParticles.children.forEach((p: THREE.Object3D) => {
      const m = p as THREE.Mesh;
      m.userData['life'] += delta;
      if (m.userData['life'] > 1.3) {
        m.userData['life'] = 0;
        m.position.set(0, 3.6, 0);
        m.userData['vel'] = new THREE.Vector3(
          (Math.random() - 0.5) * 0.8, 2 + Math.random() * 2, (Math.random() - 0.5) * 0.8
        );
      }
      const v = m.userData['vel'] as THREE.Vector3;
      v.y -= 5.5 * delta;
      m.position.add(v.clone().multiplyScalar(delta));
    });
  }

  /* ── Floating orbs ── */
  private animateOrbs(t: number): void {
    this.floatingOrbs.forEach(o => {
      o.position.y = o.userData['baseY'] + Math.sin(t * o.userData['speed'] + o.userData['phase']) * 0.6;
      o.position.x += Math.sin(t * 0.2 + o.userData['phase']) * 0.002;
    });
  }

  /* ── Clouds ── */
  private animateClouds(delta: number): void {
    this.clouds.forEach(c => {
      c.position.x += c.userData['speed'] * delta;
      if (c.position.x > 100) c.position.x = -100;
    });
  }

  /* ═══════════════════════════════════════════
     INPUT
     ═══════════════════════════════════════════ */
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    const key = e.key.toLowerCase();
    this.keys[key] = true;

    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault();
    }

    if (key === 'escape' && this.showLibraryBrowser) {
      this.ngZone.run(() => { this.closeLibraryBrowser(); });
      return;
    }

    if ((key === 'e' || e.key === 'Enter') && this.nearBuilding && !this.showLibraryBrowser) {
      if (this.nearBuilding.label === 'Digital Library') {
        this.ngZone.run(() => { this.openLibraryBrowser(); });
      } else {
        this.ngZone.run(() => { this.router.navigate([this.nearBuilding!.route]); });
      }
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
     SKY DOME
     ═══════════════════════════════════════════ */
  private buildSkyDome(): void {
    const canvas = document.createElement('canvas');
    canvas.width = 1; canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0,    '#0D2B6E'); // deep blue zenith
    grad.addColorStop(0.25, '#1E5FAD'); // mid blue
    grad.addColorStop(0.55, '#5B9BD5'); // sky blue
    grad.addColorStop(0.75, '#87CEEB'); // horizon
    grad.addColorStop(0.9,  '#C2E4F5'); // near horizon
    grad.addColorStop(1,    '#E8F4FB'); // haze
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1, 512);
    const tex = new THREE.CanvasTexture(canvas);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(240, 32, 16),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false })
    );
    dome.rotation.y = Math.PI; // orient gradient correctly
    this.scene.add(dome);
  }

  /* ═══════════════════════════════════════════
     GLOW RINGS
     ═══════════════════════════════════════════ */
  private buildGlowRings(): void {
    this.buildings.forEach((b, i) => {
      const radius = Math.max(b.width, b.depth) * 0.72;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.18, 8, 64),
        new THREE.MeshStandardMaterial({
          color: b.color,
          emissive: b.color,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.35,
          roughness: 0.2,
          metalness: 0.6
        })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(b.position[0], 0.08, b.position[1]);
      this.glowRings.push({ mesh: ring, buildingIndex: i });
      this.scene.add(ring);

      /* Colored point light per building (soft ambiance) */
      const pLight = new THREE.PointLight(b.color, 0.6, 18);
      pLight.position.set(b.position[0], 4, b.position[1]);
      this.scene.add(pLight);
    });
  }

  /* ── Glow ring animation ── */
  private animateGlowRings(t: number): void {
    this.glowRings.forEach(({ mesh, buildingIndex }) => {
      const b = this.buildings[buildingIndex];
      const isNear = this.nearBuilding === b;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      const pulse = Math.sin(t * 1.8 + buildingIndex * 1.1);
      mat.emissiveIntensity = isNear ? 1.0 + pulse * 0.4 : 0.25 + pulse * 0.1;
      mat.opacity = isNear ? 0.75 : 0.25 + pulse * 0.05;
      const scale = 1 + (isNear ? 0.06 : 0.02) * Math.sin(t * 2 + buildingIndex);
      mesh.scale.setScalar(scale);
    });
  }

  /* ═══════════════════════════════════════════
     LIBRARY BROWSER
     ═══════════════════════════════════════════ */
  openLibraryBrowser(): void {
    this.showLibraryBrowser = true;
    this.libraryView = 'browse';
    this.checkoutSuccess = false;
    this.libraryLoading = true;
    this.libraryService.getAll().subscribe({
      next: (products) => this.ngZone.run(() => {
        this.libraryProducts = products;
        this.libraryLoading = false;
      }),
      error: () => this.ngZone.run(() => {
        this.libraryProducts = [];
        this.libraryLoading = false;
      })
    });
    if (this.userId) this.loadCart();
  }

  closeLibraryBrowser(): void {
    this.showLibraryBrowser = false;
  }

  /* ── Cart methods ── */
  loadCart(): void {
    if (!this.userId) return;
    this.cartService.getCart(this.userId).subscribe({
      next: cart => this.ngZone.run(() => { this.cart = cart; }),
      error: () => {}
    });
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.userId) { alert('Please log in to add items to your cart.'); return; }
    if (this.addingToCart.has(product.id!)) return;
    this.addingToCart.add(product.id!);
    this.cartService.addToCart(this.userId, product.id!).subscribe({
      next: cart => this.ngZone.run(() => { this.cart = cart; this.addingToCart.delete(product.id!); }),
      error: () => this.ngZone.run(() => { this.addingToCart.delete(product.id!); })
    });
  }

  removeFromCart(cartItemId: number): void {
    if (!this.userId) return;
    this.cartService.removeItem(this.userId, cartItemId).subscribe({
      next: cart => this.ngZone.run(() => { this.cart = cart; }),
      error: () => {}
    });
  }

  isInCart(productId: number | undefined): boolean {
    if (!productId || !this.cart) return false;
    return this.cart.items.some(i => i.product.id === productId);
  }

  getCartItemCount(): number {
    return this.cart?.items.reduce((s, i) => s + i.quantity, 0) ?? 0;
  }

  getCartTotal(): number {
    return this.cart?.items.reduce((s, i) => s + i.product.price * i.quantity, 0) ?? 0;
  }

  checkout(): void {
    if (!this.userId || !this.cart?.items.length) return;
    this.checkoutLoading = true;
    this.cartService.checkout(this.userId).subscribe({
      next: () => this.ngZone.run(() => {
        this.checkoutLoading = false;
        this.checkoutSuccess = true;
        this.cart = null;
        setTimeout(() => {
          this.checkoutSuccess = false;
          this.libraryView = 'browse';
        }, 3500);
      }),
      error: () => this.ngZone.run(() => {
        this.checkoutLoading = false;
        alert('Checkout failed. Please try again.');
      })
    });
  }

  /* ═══════════════════════════════════════════
     PUBLIC
     ═══════════════════════════════════════════ */
  navigateTo(route: string): void { this.router.navigate([route]); }
  goHome(): void { this.router.navigate(['/']); }

  interact(): void {
    if (!this.nearBuilding) return;
    if (this.nearBuilding.label === 'Digital Library') {
      this.openLibraryBrowser();
    } else {
      this.router.navigate([this.nearBuilding.route]);
    }
  }
}

