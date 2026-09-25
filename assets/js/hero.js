/* Decorative abstract geometry only; no product geometry or product imagery. */
export function createHero(THREE, gsap, host) {
  const hero = host.closest('.hero');
  const toggle = hero.querySelector('.motion-toggle');
  const tokens = getComputedStyle(document.documentElement);
  const colour = token => new THREE.Color(tokens.getPropertyValue(token).trim());
  const accent = colour('--accent');
  const paper = colour('--paper');
  const base = colour('--base');
  const narrow = matchMedia('(max-width: 640px)').matches;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
  camera.position.set(0, 0, 10.8);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !narrow, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true });
  } catch { return { dispose() {} }; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, narrow ? 1.25 : 1.65));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearAlpha(0);
  renderer.domElement.className = 'hero-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.append(renderer.domElement);

  const root = new THREE.Group();
  root.position.set(.05, .05, 0);
  scene.add(root);
  const discVertex = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec4 p = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vPosition = p.xyz;
      gl_Position = projectionMatrix * p;
    }
  `;
  const discFragment = `
    uniform vec3 uAccent;
    uniform vec3 uPaper;
    uniform vec3 uBase;
    uniform float uScan;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 n = normalize(vNormal);
      vec3 view = normalize(-vPosition);
      float rim = pow(1.0 - abs(dot(n, view)), 2.1);
      vec3 light = normalize(vec3(-0.55, 0.8, 1.6));
      float shine = pow(max(dot(reflect(-light, n), view), 0.0), 24.0);
      float soft = pow(max(dot(n, light), 0.0), 4.0);
      vec3 c = mix(uBase, uAccent, 0.48 + soft * 0.4);
      c = mix(c, uPaper, clamp(rim * 0.76 + shine * 0.85 + soft * 0.25 + uScan * 0.44, 0.0, 1.0));
      float alpha = clamp(0.48 + rim * 0.45 + shine * 0.2 + uScan * 0.3, 0.0, 1.0);
      gl_FragColor = vec4(c, alpha);
    }
  `;
  const spine = new THREE.Group();
  root.add(spine);
  const discGeometry = new THREE.SphereGeometry(1, narrow ? 24 : 40, narrow ? 14 : 24);
  const discs = [];
  for (let i = 0; i < 17; i++) {
    const t = i / 16;
    const material = new THREE.ShaderMaterial({
      uniforms: { uAccent: { value: accent }, uPaper: { value: paper }, uBase: { value: base }, uScan: { value: 0 } },
      vertexShader: discVertex, fragmentShader: discFragment, transparent: true, depthWrite: false
    });
    const disc = new THREE.Mesh(discGeometry, material);
    disc.position.set(Math.sin(t * 5.2) * .23, 2.64 - t * 5.28, Math.sin(t * 4.5) * .13 + .5);
    const width = .3 + Math.sin(t * Math.PI) * .17;
    disc.scale.set(width, .13 + t * .02, .25);
    disc.rotation.set(.24, -.18, -.12 + Math.sin(t * 4) * .13);
    discs.push(disc);
    spine.add(disc);
  }

  const noise = `
    float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
    float noise3(vec3 p) {
      vec3 i = floor(p); vec3 f = fract(p); f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
    }
  `;
  const blobMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uAccent: { value: accent }, uPaper: { value: paper }, uBase: { value: base } },
    vertexShader: `
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vNoise;
      ${noise}
      void main() {
        float n = noise3(position * 1.45 + vec3(uTime * 0.1, uTime * 0.07, 0.0));
        float fine = noise3(position * 3.0 - uTime * 0.07);
        vec3 p = position + normal * (n * 0.65 + fine * 0.12);
        p.x += sin(p.y * 1.7 + uTime * 0.13) * 0.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vPosition = mv.xyz;
        vNoise = n;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uAccent;
      uniform vec3 uPaper;
      uniform vec3 uBase;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vNoise;
      void main() {
        vec3 n = normalize(vNormal);
        vec3 view = normalize(-vPosition);
        float rim = pow(1.0 - abs(dot(n, view)), 2.3);
        float ribbon = pow(abs(sin(vNoise * 9.0 + n.y * 1.8)), 16.0);
        float shine = pow(max(dot(reflect(normalize(vec3(0.4,-0.6,-1.0)),n),view),0.0),32.0);
        vec3 c = mix(uBase, uAccent, 0.7);
        c = mix(c, uPaper, clamp(rim * 0.38 + shine * 0.45 + ribbon * 0.13, 0.0, 0.8));
        gl_FragColor = vec4(c, 0.09 + rim * 0.45 + ribbon * 0.15 + shine * 0.2);
      }
    `,
    transparent: true, depthWrite: false, side: THREE.FrontSide
  });
  const blobGeometry = new THREE.SphereGeometry(1.7, narrow ? 36 : 64, narrow ? 28 : 56);
  const blob = new THREE.Mesh(blobGeometry, blobMaterial);
  blob.scale.set(1.17, 1.68, .75);
  blob.position.set(-.38, -.04, -1.15);
  root.add(blob);

  const particleCount = narrow ? 20 : 72;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const f = i * 2.399963;
    positions[i * 3] = Math.sin(f) * (1.4 + (i % 7) * .37);
    positions[i * 3 + 1] = Math.cos(f * .73) * 3.5;
    positions[i * 3 + 2] = -1.5 - (i % 5) * .4;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({ color: accent.clone().lerp(paper, .4), size: narrow ? .018 : .016, transparent: true, opacity: .45, depthWrite: false });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  root.add(particles);

  const beamMaterial = new THREE.ShaderMaterial({
    uniforms: { uPaper: { value: paper }, uAccent: { value: accent }, uOpacity: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      uniform vec3 uPaper; uniform vec3 uAccent; uniform float uOpacity; varying vec2 vUv;
      void main() {
        float x=abs(vUv.x-.5)*2.0; float y=abs(vUv.y-.5)*2.0;
        float line=exp(-y*55.0); float halo=exp(-y*5.0)*.2;
        float fade=pow(1.0-x,2.5);
        gl_FragColor=vec4(mix(uAccent,uPaper,line*.82),(line+halo)*fade*uOpacity);
      }
    `,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending
  });
  const beamGeometry = new THREE.PlaneGeometry(7, .37);
  const beam = new THREE.Mesh(beamGeometry, beamMaterial);
  beam.position.set(0, 3.05, 1);
  root.add(beam);
  const scan = { y: 3.05, glow: 1 };
  const scanTimeline = gsap.timeline({ paused: true });
  scanTimeline.to(scan, { y: -3.05, duration: 4.4, delay: .55, ease: 'power1.inOut' });
  scanTimeline.to(scan, { glow: 0, duration: .6 }, '-=.3');

  let disposed = false;
  let inView = true;
  let paused = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let shaderFailed = false;
  const pointer = { x: 0, y: 0 };
  const pointerTo = { x: 0, y: 0 };
  const fps = narrow ? 30 : 45;
  const resize = () => {
    if (disposed) return;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  const onPointer = event => {
    const bounds = hero.getBoundingClientRect();
    pointerTo.x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    pointerTo.y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
  };
  const resetPointer = () => { pointerTo.x = 0; pointerTo.y = 0; };
  const render = now => {
    if (disposed || paused || !inView || document.hidden) { frame = 0; return; }
    frame = requestAnimationFrame(render);
    if (now - previous < 1000 / fps) return;
    const delta = Math.min((now - previous) / 1000, .05);
    previous = now;
    elapsed += delta;
    pointer.x += (pointerTo.x - pointer.x) * .035;
    pointer.y += (pointerTo.y - pointer.y) * .035;
    root.rotation.y = pointer.x * .13;
    root.rotation.x = pointer.y * .065;
    root.position.x = .05 + pointer.x * .06;
    blobMaterial.uniforms.uTime.value = elapsed;
    blob.rotation.z = Math.sin(elapsed * .11) * .08;
    blob.rotation.y = elapsed * .035;
    particles.rotation.z = elapsed * .008;
    beam.position.y = scan.y;
    beamMaterial.uniforms.uOpacity.value = scan.glow;
    discs.forEach(disc => {
      const distance = Math.abs(disc.position.y - scan.y);
      disc.material.uniforms.uScan.value = Math.exp(-distance * distance * 12) * scan.glow;
    });
    renderer.render(scene, camera);
  };
  const updatePlayback = () => {
    const active = !disposed && inView && !paused && !document.hidden;
    if (active) {
      scanTimeline.resume();
      previous = performance.now();
      if (!frame) frame = requestAnimationFrame(render);
    } else {
      scanTimeline.pause();
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
  const onToggle = () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
    updatePlayback();
  };
  const onContextLost = event => { event.preventDefault(); dispose(); };
  const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; updatePlayback(); }, { threshold: 0 });
  const resizeObserver = new ResizeObserver(resize);
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    scanTimeline.kill();
    observer.disconnect();
    resizeObserver.disconnect();
    hero.removeEventListener('pointermove', onPointer);
    hero.removeEventListener('pointerleave', resetPointer);
    document.removeEventListener('visibilitychange', updatePlayback);
    toggle.removeEventListener('click', onToggle);
    renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
    discGeometry.dispose();
    discs.forEach(disc => disc.material.dispose());
    blobGeometry.dispose(); blobMaterial.dispose();
    particleGeometry.dispose(); particleMaterial.dispose();
    beamGeometry.dispose(); beamMaterial.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    host.classList.remove('is-live');
    toggle.hidden = true;
  }
  try {
    renderer.debug.onShaderError = () => { shaderFailed = true; };
    resize();
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    if (shaderFailed) { dispose(); return { dispose }; }
    host.classList.add('is-live');
    toggle.hidden = false;
    toggle.setAttribute('aria-pressed', 'false');
    toggle.textContent = 'Pause motion';
    toggle.addEventListener('click', onToggle);
    hero.addEventListener('pointermove', onPointer, { passive: true });
    hero.addEventListener('pointerleave', resetPointer);
    document.addEventListener('visibilitychange', updatePlayback);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    observer.observe(hero);
    resizeObserver.observe(host);
    updatePlayback();
  } catch { dispose(); }
  return { dispose };
}
