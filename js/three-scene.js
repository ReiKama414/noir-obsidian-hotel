/* ==========================================================================
   L'OBSIDIENNE PALACE — Three.js 3D Black Marble Monolith & Gold Vein Shader
   Features:
   - Procedural Canvas 2D + GLSL Shader Material simulating polished Nero Marquina
     Black Marble with liquid 24K gold veins and dynamic Fresnel specular reflection
   - Multi-layered Architectural Monolith (Core Octahedron/Icosahedron, Floating
     Obsidian Slabs, Gimbal Brass Rings, and 24K Gold Stardust Particle Field)
   - Interactive States controlled by GSAP & User UI (Explode View, Material Theme,
     Camera Presets, Mouse/Touch Parallax & Interactive Drag Rotation)
   ========================================================================== */

(function () {
  const container = document.getElementById('webgl-container');
  const fallback = document.getElementById('webgl-fallback');
  if (!container || typeof THREE === 'undefined') {
    if (fallback) fallback.hidden = false;
    return;
  }

  let webglOk = true;
  try {
    const testCanvas = document.createElement('canvas');
    webglOk = !!(testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'));
  } catch (err) {
    webglOk = false;
  }
  if (!webglOk) {
    if (fallback) fallback.hidden = false;
    return;
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches || navigator.maxTouchPoints > 1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const maxDpr = isMobile ? 1.25 : 1.75;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070709, 0.045);

  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.55, 9.6);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'default' : 'high-performance'
    });
  } catch (err) {
    if (fallback) fallback.hidden = false;
    return;
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.82;
  container.appendChild(renderer.domElement);

  // ---------------------------------------------------------------------------
  // Procedural Black Marble & Gold Veins Texture Generator (No external files!)
  // ---------------------------------------------------------------------------
  let currentDiffTex = null;
  let currentBumpTex = null;

  function disposeTexturePair() {
    if (currentDiffTex) {
      currentDiffTex.dispose();
      currentDiffTex = null;
    }
    if (currentBumpTex) {
      currentBumpTex.dispose();
      currentBumpTex = null;
    }
  }

  function createProceduralMarbleTextures(theme) {
    const size = isMobile ? 512 : 768;
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = size;
    diffCanvas.height = size;
    const ctx = diffCanvas.getContext('2d');

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = size;
    bumpCanvas.height = size;
    const bCtx = bumpCanvas.getContext('2d');

    // Palettes
    const palettes = {
      nero: {
        base1: '#060608',
        base2: '#101218',
        veinPrimary: 'rgba(168, 148, 110, 0.55)',
        veinSecondary: 'rgba(190, 175, 145, 0.28)',
        veinSubtle: 'rgba(255, 255, 255, 0.1)'
      },
      verde: {
        base1: '#040a08',
        base2: '#0b1d17',
        veinPrimary: 'rgba(140, 168, 148, 0.45)',
        veinSecondary: 'rgba(110, 160, 140, 0.28)',
        veinSubtle: 'rgba(220, 245, 230, 0.12)'
      },
      liquidGold: {
        base1: '#0a0805',
        base2: '#16120c',
        veinPrimary: 'rgba(180, 150, 95, 0.55)',
        veinSecondary: 'rgba(160, 130, 80, 0.35)',
        veinSubtle: 'rgba(230, 210, 170, 0.16)'
      }
    };
    const pal = palettes[theme] || palettes.nero;

    // Base dark marble gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, pal.base1);
    grad.addColorStop(0.5, pal.base2);
    grad.addColorStop(1, pal.base1);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Mineral cloud blotches
    for (let i = 0; i < 45; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 60 + Math.random() * 180;
      const g = ctx.createRadialGradient(x, y, 5, x, y, r);
      g.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
      g.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Helper to draw jagged natural stone veins
    function drawMarbleVein(strokeStyle, width, alpha, count, bumpColor) {
      ctx.save();
      bCtx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.globalAlpha = alpha;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      bCtx.strokeStyle = bumpColor;
      bCtx.lineCap = 'round';

      for (let v = 0; v < count; v++) {
        let x = Math.random() * size;
        let y = 0;
        let angle = (Math.PI / 2) + (Math.random() - 0.5) * 0.9;

        ctx.beginPath();
        bCtx.beginPath();
        ctx.moveTo(x, y);
        bCtx.moveTo(x, y);

        const steps = 48;
        for (let s = 0; s < steps; s++) {
          angle += (Math.random() - 0.5) * 0.65;
          const stepLen = size / (steps * 0.75);
          x += Math.cos(angle) * stepLen;
          y += Math.sin(angle) * stepLen;
          ctx.lineWidth = Math.max(0.5, width * (0.4 + Math.random() * 0.9));
          bCtx.lineWidth = ctx.lineWidth * 1.4;
          ctx.lineTo(x, y);
          bCtx.lineTo(x, y);

          // Occasional micro-fissure branch
          if (Math.random() < 0.18) {
            ctx.moveTo(x, y);
            const bx = x + (Math.random() - 0.5) * 90;
            const by = y + (Math.random() - 0.5) * 90;
            ctx.lineTo(bx, by);
            ctx.moveTo(x, y);
          }
        }
        ctx.stroke();
        bCtx.stroke();
      }
      ctx.restore();
      bCtx.restore();
    }

    // Subtle white calcite veins
    drawMarbleVein(pal.veinSubtle, 3.2, 0.55, 18, '#969696');
    // Secondary champagne gold veins
    drawMarbleVein(pal.veinSecondary, 2.2, 0.78, 14, '#c8c8c8');
    // Primary 24K bright gold veins
    drawMarbleVein(pal.veinPrimary, 1.5, 0.95, 10, '#ffffff');

    const diffTex = new THREE.CanvasTexture(diffCanvas);
    diffTex.wrapS = THREE.RepeatWrapping;
    diffTex.wrapT = THREE.RepeatWrapping;
    diffTex.repeat.set(1.5, 1.5);

    const bumpTex = new THREE.CanvasTexture(bumpCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(1.5, 1.5);

    return { diffTex, bumpTex };
  }

  const currentTextures = createProceduralMarbleTextures('nero');
  currentDiffTex = currentTextures.diffTex;
  currentBumpTex = currentTextures.bumpTex;

  // ---------------------------------------------------------------------------
  // Materials: Polished Nero Marquina Marble + Brushed 24K Gold
  // ---------------------------------------------------------------------------
  const marbleMaterial = new THREE.MeshStandardMaterial({
    map: currentDiffTex,
    bumpMap: currentBumpTex,
    bumpScale: 0.022,
    roughnessMap: currentBumpTex,
    roughness: 0.48,
    metalness: 0.08
  });

  const darkSlabMaterial = new THREE.MeshStandardMaterial({
    map: currentDiffTex,
    bumpMap: currentBumpTex,
    bumpScale: 0.016,
    roughness: 0.55,
    metalness: 0.06
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0x6e6558,
    emissive: 0x0c0b09,
    emissiveIntensity: 0.04,
    roughness: 0.55,
    metalness: 0.45
  });

  const wireframeGoldMaterial = new THREE.MeshBasicMaterial({
    color: 0x5c564c,
    wireframe: true,
    transparent: true,
    opacity: 0.035
  });

  // ---------------------------------------------------------------------------
  // Main 3D Architectural Sculpture Group
  // ---------------------------------------------------------------------------
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  const monolithGroup = new THREE.Group();
  rootGroup.add(monolithGroup);

  // 1. Central Faceted Black Marble Monolith Crystal
  const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
  // Stretch vertically like an architectural obelisk/monolith
  coreGeo.scale(0.88, 1.48, 0.88);
  const coreMesh = new THREE.Mesh(coreGeo, marbleMaterial);
  monolithGroup.add(coreMesh);

  // 2. Wireframe cage — hidden at rest, only for explode / atelier
  const cageGeo = new THREE.IcosahedronGeometry(1.62, 1);
  cageGeo.scale(0.9, 1.5, 0.9);
  const cageMesh = new THREE.Mesh(cageGeo, wireframeGoldMaterial);
  cageMesh.visible = false;
  monolithGroup.add(cageMesh);

  // 3. Single quiet orbital ring
  const ring1Geo = new THREE.TorusGeometry(2.55, 0.008, 12, 80);
  const ring1Mesh = new THREE.Mesh(ring1Geo, goldMaterial);
  ring1Mesh.rotation.x = Math.PI * 0.4;
  ring1Mesh.rotation.y = Math.PI * 0.1;
  ring1Mesh.material = goldMaterial.clone();
  ring1Mesh.material.opacity = 0.55;
  ring1Mesh.material.transparent = true;
  monolithGroup.add(ring1Mesh);

  const ring2Mesh = ring1Mesh;

  // 4. Two quiet satellite slabs — denser when exploded
  const satelliteShards = [];
  const shardConfigs = [
    { pos: [-1.85, 0.75, 0.35], rot: [0.3, 0.55, 0.12], scale: [0.28, 0.55, 0.08] },
    { pos: [1.9, -0.65, 0.3], rot: [-0.28, -0.4, 0.1], scale: [0.26, 0.5, 0.08] }
  ];

  const shardGeo = new THREE.OctahedronGeometry(0.65, 0);
  shardConfigs.forEach((cfg, idx) => {
    const shard = new THREE.Mesh(shardGeo, darkSlabMaterial);
    shard.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
    shard.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2]);
    shard.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
    shard.userData = {
      basePos: new THREE.Vector3(cfg.pos[0], cfg.pos[1], cfg.pos[2]),
      baseRot: new THREE.Euler(cfg.rot[0], cfg.rot[1], cfg.rot[2]),
      phase: idx * 0.85
    };
    monolithGroup.add(shard);
    satelliteShards.push(shard);
  });

  // 5. Sparse dust field
  const particleCount = isMobile ? 80 : 140;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x8a8378,
    size: 0.024,
    transparent: true,
    opacity: 0.35,
    blending: THREE.NormalBlending,
    depthWrite: false
  });
  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // ---------------------------------------------------------------------------
  // Cinematic Architectural Lighting
  // ---------------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0x1a1a1e, 1.1);
  scene.add(ambientLight);

  const goldPointLight = new THREE.PointLight(0xb0a792, 1.35, 18);
  goldPointLight.position.set(3.2, 2.4, 4.2);
  scene.add(goldPointLight);

  const rimLight = new THREE.DirectionalLight(0x5a6270, 0.85);
  rimLight.position.set(-5, 4, -4);
  scene.add(rimLight);

  const underLight = new THREE.PointLight(0x4a4338, 0.7, 12);
  underLight.position.set(0, -4.0, 2.0);
  scene.add(underLight);

  // ---------------------------------------------------------------------------
  // Interactive State & API for GSAP / UI Controls
  // ---------------------------------------------------------------------------
  const state = {
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0,
    targetRotY: 0,
    explosionFactor: 0,
    isExploded: false,
    orbitMode: false,
    isDragging: false,
    prevDragX: 0,
    prevDragY: 0,
    manualRotX: 0,
    manualRotY: 0,
    theme: 'nero'
  };

  let rafMouse = 0;
  function onPointerMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    if (rafMouse) return;
    rafMouse = requestAnimationFrame(() => {
      rafMouse = 0;
      state.mouseX = (clientX / window.innerWidth) * 2 - 1;
      state.mouseY = -(clientY / window.innerHeight) * 2 + 1;
      if (state.isDragging && state.orbitMode) {
        const dx = clientX - state.prevDragX;
        const dy = clientY - state.prevDragY;
        state.manualRotY += dx * 0.008;
        state.manualRotX += dy * 0.008;
        state.prevDragX = clientX;
        state.prevDragY = clientY;
      }
    });
  }

  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  function startDrag(e) {
    if (!state.orbitMode) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    state.isDragging = true;
    state.prevDragX = clientX;
    state.prevDragY = clientY;
  }

  function endDrag() {
    state.isDragging = false;
  }

  window.addEventListener('mousedown', startDrag);
  window.addEventListener('touchstart', startDrag, { passive: true });
  window.addEventListener('mouseup', endDrag);
  window.addEventListener('touchend', endDrag);

  let resizeTimer = 0;
  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  }
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(onResize, 120);
  });

  // Expose API to window.ObsidianScene for GSAP ScrollTrigger & UI buttons
  window.ObsidianScene = {
    scene,
    camera,
    rootGroup,
    monolithGroup,
    coreMesh,
    cageMesh,
    ring1Mesh,
    ring2Mesh,
    goldPointLight,
    state,

    setMarbleTheme: function (themeKey) {
      state.theme = themeKey;
      disposeTexturePair();
      const newTex = createProceduralMarbleTextures(themeKey);
      currentDiffTex = newTex.diffTex;
      currentBumpTex = newTex.bumpTex;
      marbleMaterial.map = newTex.diffTex;
      marbleMaterial.bumpMap = newTex.bumpTex;
      marbleMaterial.roughnessMap = newTex.bumpTex;
      marbleMaterial.needsUpdate = true;

      darkSlabMaterial.map = newTex.diffTex;
      darkSlabMaterial.bumpMap = newTex.bumpTex;
      darkSlabMaterial.needsUpdate = true;

      if (typeof gsap !== 'undefined') {
        const lightColors = {
          nero: { r: 0.77, g: 0.71, b: 0.6 },
          verde: { r: 0.55, g: 0.72, b: 0.64 },
          liquidGold: { r: 0.82, g: 0.7, b: 0.48 }
        };
        const c = lightColors[themeKey] || lightColors.nero;
        gsap.to(goldPointLight.color, { r: c.r, g: c.g, b: c.b, duration: 1.15, ease: 'power2.out' });
        gsap.fromTo(
          monolithGroup.scale,
          { x: 0.96, y: 0.96, z: 0.96 },
          { x: 1, y: 1, z: 1, duration: 0.85, ease: 'power3.out' }
        );
      }
    },

    toggleExplode: function (forceState) {
      state.isExploded = typeof forceState === 'boolean' ? forceState : !state.isExploded;
      const target = state.isExploded ? 1 : 0;
      if (typeof gsap !== 'undefined') {
        gsap.to(state, {
          explosionFactor: target,
          duration: 1.35,
          ease: 'expo.inOut'
        });
        cageMesh.visible = true;
        gsap.to(cageMesh.scale, {
          x: state.isExploded ? 1.28 : 0.9,
          y: state.isExploded ? 1.88 : 1.5,
          z: state.isExploded ? 1.28 : 0.9,
          duration: 1.35,
          ease: 'expo.inOut',
          onComplete: () => {
            if (!state.isExploded) cageMesh.visible = false;
          }
        });
        gsap.to(ring1Mesh.scale, {
          x: state.isExploded ? 1.22 : 1,
          y: state.isExploded ? 1.22 : 1,
          z: state.isExploded ? 1.22 : 1,
          duration: 1.35,
          ease: 'expo.inOut'
        });
      } else {
        state.explosionFactor = target;
      }
      return state.isExploded;
    },

    toggleOrbitInspect: function (forceState) {
      state.orbitMode = typeof forceState === 'boolean' ? forceState : !state.orbitMode;
      if (typeof gsap !== 'undefined') {
        gsap.to(camera.position, {
          x: 0,
          y: state.orbitMode ? 0.15 : 0.4,
          z: state.orbitMode ? 6.4 : 9.2,
          duration: 1.2,
          ease: 'power3.inOut'
        });
      }
      return state.orbitMode;
    },

    focusHotspot: function (index) {
      if (typeof gsap === 'undefined') return;
      const presets = [
        { camPos: [0.25, 0.45, 7.2], rot: [0.12, 0.45, 0.02], explode: 0.12 },
        { camPos: [-0.85, 0.25, 6.8], rot: [-0.18, -0.55, 0.06], explode: 0.42 },
        { camPos: [0.75, -0.1, 7.0], rot: [0.28, 0.85, -0.08], explode: 0.22 },
        { camPos: [0.05, 0.7, 7.4], rot: [-0.08, 1.15, 0.1], explode: 0.55 }
      ];
      const p = presets[index % presets.length];
      gsap.to(camera.position, {
        x: p.camPos[0],
        y: p.camPos[1],
        z: p.camPos[2],
        duration: 1.3,
        ease: 'power3.inOut'
      });
      gsap.to(monolithGroup.rotation, {
        x: p.rot[0],
        y: p.rot[1],
        z: p.rot[2],
        duration: 1.4,
        ease: 'power3.inOut'
      });
      gsap.to(state, {
        explosionFactor: p.explode,
        duration: 1.3,
        ease: 'power3.inOut'
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Render Loop
  // ---------------------------------------------------------------------------
  const clock = new THREE.Clock();
  let rafId = 0;
  let isPageVisible = document.visibilityState !== 'hidden';
  let disposed = false;

  function animate() {
    if (disposed) return;
    if (!isPageVisible) {
      rafId = 0;
      return;
    }
    rafId = requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();
    const speed = reduceMotion ? 0.35 : 1;

    goldPointLight.position.x += (state.mouseX * 5.5 - goldPointLight.position.x) * 0.06;
    goldPointLight.position.y += (state.mouseY * 4.0 + 1.2 - goldPointLight.position.y) * 0.06;

    coreMesh.rotation.y = elapsed * 0.07 * speed + state.manualRotY;
    coreMesh.rotation.x = Math.sin(elapsed * 0.22 * speed) * 0.04 + state.manualRotX;
    cageMesh.rotation.y = -elapsed * 0.05 * speed + state.manualRotY;

    ring1Mesh.rotation.z = elapsed * 0.08 * speed;
    ring1Mesh.rotation.y = Math.PI * 0.12 + Math.sin(elapsed * 0.25 * speed) * 0.08;

    rootGroup.rotation.y += (state.mouseX * 0.28 - rootGroup.rotation.y) * 0.05;
    rootGroup.rotation.x += (-state.mouseY * 0.18 - rootGroup.rotation.x) * 0.05;

    const exp = state.explosionFactor;
    for (let i = 0; i < satelliteShards.length; i++) {
      const shard = satelliteShards[i];
      const u = shard.userData;
      const floatOffset = Math.sin(elapsed * 1.4 * speed + u.phase) * 0.16;
      const expandMult = 1 + exp * 0.72;
      shard.position.x = u.basePos.x * expandMult;
      shard.position.y = u.basePos.y * expandMult + floatOffset;
      shard.position.z = u.basePos.z * expandMult;
      shard.rotation.x = u.baseRot.x + elapsed * 0.25 * speed;
      shard.rotation.y = u.baseRot.y + elapsed * 0.32 * speed;
    }

    particleSystem.rotation.y = elapsed * 0.025 * speed;
    particleSystem.position.y = Math.sin(elapsed * 0.3 * speed) * 0.25;

    renderer.render(scene, camera);
  }

  document.addEventListener('visibilitychange', () => {
    isPageVisible = document.visibilityState !== 'hidden';
    if (isPageVisible && !disposed && !rafId) animate();
  });

  function disposeScene() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(rafId);
    rafId = 0;
    disposeTexturePair();
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((m) => {
          if (m.map) m.map.dispose();
          if (m.bumpMap) m.bumpMap.dispose();
          if (m.roughnessMap) m.roughnessMap.dispose();
          m.dispose();
        });
      }
    });
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    window.ObsidianScene = null;
  }

  window.addEventListener('pagehide', disposeScene);
  window.ObsidianSceneDispose = disposeScene;

  animate();
})();
