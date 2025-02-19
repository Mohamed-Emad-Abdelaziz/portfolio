(function initThreeJS() {
    // =========== 3D SCENE SETUP ===========
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
  
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
  
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);
  
    // Plane
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
  
    camera.position.set(0, 15, 30);
    camera.lookAt(0, 0, 0);
  
    // =========== BAR CHART ===========
    const barGroup = new THREE.Group();
    scene.add(barGroup);
  
    const barData = [5, 9, 2, 7, 3, 8, 4];
    barData.forEach((val, i) => {
      const geo = new THREE.BoxGeometry(0.5, val, 0.5);
      const mat = new THREE.MeshStandardMaterial({ color: 0x1DB954 });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.x = i * 0.8;
      bar.position.y = val * 0.5; 
      bar.castShadow = true;
      barGroup.add(bar);
    });
    barGroup.position.set(-2, 0, -12);
  
    // =========== SCATTER PLOT ===========
    const scatterGroup = new THREE.Group();
    scene.add(scatterGroup);
  
    // Example scatter data
    const scatterData = [
      { x: 2, y: 3, z: 1 },
      { x: -3, y: 1, z: 4 },
      { x: 4, y: 2, z: -2 },
      { x: 1, y: 4, z: 3 },
      { x: -2, y: 2, z: -1 },
      { x: 3, y: 5, z: 2 },
      { x: 1, y: 1, z: 1 }
    ];
  
    scatterData.forEach(point => {
      const sphereGeo = new THREE.SphereGeometry(0.3, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff1e1e });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(point.x, point.y, point.z);
      sphere.castShadow = true;
      scatterGroup.add(sphere);
    });
  
    scatterGroup.position.set(-8, 0, 5);
  
    // =========== DONUT (PIE) CHART ===========
    const pieGroup = new THREE.Group();
    scene.add(pieGroup);
  
    const pieData = [30, 50, 80, 40]; // total 200
    const totalAngle = 2 * Math.PI;
    let startAngle = 0;
    const colors = [0xffc300, 0xff5733, 0xc70039, 0x900c3f];
  
    pieData.forEach((sliceValue, i) => {
      const sliceAngle = (sliceValue / 200) * totalAngle;
      const torusGeo = new THREE.TorusGeometry(2, 0.6, 16, 64, sliceAngle);
      const torusMat = new THREE.MeshStandardMaterial({ color: colors[i] || 0xffffff });
      const torus = new THREE.Mesh(torusGeo, torusMat);
      torus.rotation.x = -Math.PI / 2;
      torus.castShadow = true;
  
      const subGroup = new THREE.Group();
      subGroup.add(torus);
      subGroup.rotation.y = startAngle;
      pieGroup.add(subGroup);
  
      startAngle += sliceAngle;
    });
  
    pieGroup.position.set(8, 0, 5);
  
    // =========== LINE CHART ===========
    const lineGroup = new THREE.Group();
    scene.add(lineGroup);
  
    const lineData = [1, 3, 5, 2, 6, 4, 7];
    const linePoints = new THREE.Group();
    lineGroup.add(linePoints);
  
    const materialLine = new THREE.LineBasicMaterial({ color: 0x00aaff });
    const geometryLine = new THREE.BufferGeometry();
    const positions = [];
  
    lineData.forEach((val, i) => {
      const sphereGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({ color: 0x00aaff });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  
      sphere.position.set(i, val, 0);
      sphere.castShadow = true;
      linePoints.add(sphere);
  
      positions.push(i, val, 0);
    });
  
    geometryLine.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(new Float32Array(positions), 3)
    );
    const line = new THREE.Line(geometryLine, materialLine);
    lineGroup.add(line);
  
    lineGroup.position.set(-3, 0, 12);
  
    // =========== ANIMATION LOOP ===========
    function animate() {
      requestAnimationFrame(animate);
      barGroup.rotation.y += 0.003;
      scatterGroup.rotation.y += 0.004;
      pieGroup.rotation.y += 0.002;
      lineGroup.rotation.y += 0.002;
  
      renderer.render(scene, camera);
    }
    animate();
  
    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  })();
  
  /* 
     ============ HAMBURGER MENU TOGGLE =========== 
     This code toggles the navbar open/closed on small screens.
     On large screens, the navbar is always visible (max-height: none).
  */
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');
  
  // If the user clicks the hamburger on small screens, expand/collapse.
  menuToggle.addEventListener('click', () => {
    // If nav is collapsed (max-height=0), expand it; otherwise collapse it
    if (navbar.style.maxHeight && navbar.style.maxHeight !== '0px') {
      navbar.style.maxHeight = '0';
    } else {
      navbar.style.maxHeight = '500px'; 
    }
  });
  