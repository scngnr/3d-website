'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSG } from 'three-csg-ts';

interface LogoPreview3DProps {
  imageUrl: string;
  width?: number;
  height?: number;
}

export default function LogoPreview3D({ imageUrl, width = 0, height = 0 }: LogoPreview3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageUrl) return;

    // Clean up any existing WebGL renderer
    const existingCanvas = containerRef.current.querySelector('canvas');
    if (existingCanvas) {
      containerRef.current.removeChild(existingCanvas);
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;

    // Create texture from uploaded image
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(imageUrl);
    texture.colorSpace = 'srgb';

    // Create materials
    const logoMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      metalness: 0.3,
      roughness: 0.7
    });

    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x404040,
      metalness: 0.8,
      roughness: 0.2
    });

    // Create logo plane with frame
    const aspectRatio = width && height ? width / height : 1;
    const baseSize = 2;
    const logoGeometry = new THREE.PlaneGeometry(baseSize * aspectRatio, baseSize);
    const frameGeometry = new THREE.BoxGeometry(baseSize * aspectRatio + 0.4, baseSize + 0.4, 0.1);
    
    // Create hole in frame
    const frameHoleGeometry = new THREE.BoxGeometry(baseSize * aspectRatio + 0.1, baseSize + 0.1, 0.2);
    const frameMesh = new THREE.Mesh(frameGeometry, frameMaterial);
    const holeFrameMesh = new THREE.Mesh(frameHoleGeometry);
    const frameCSG = CSG.fromMesh(frameMesh);
    const holeCSG = CSG.fromMesh(holeFrameMesh);
    const finalFrameCSG = frameCSG.subtract(holeCSG);
    const finalFrame = CSG.toMesh(finalFrameCSG, frameMesh.matrix, frameMaterial);

    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.position.z = -0.01; // Slightly behind frame

    // Create group for logo and frame
    const signGroup = new THREE.Group();
    signGroup.add(finalFrame);
    signGroup.add(logoMesh);
    signGroup.rotation.x = -0.2; // Tilt slightly back
    scene.add(signGroup);

    // Position camera
    camera.position.z = 4;
    camera.position.y = 1;
    camera.lookAt(0, 0, 0);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const frontLight = new THREE.SpotLight(0xffffff, 1);
    frontLight.position.set(0, 2, 4);
    frontLight.angle = Math.PI / 4;
    frontLight.penumbra = 0.3;
    frontLight.castShadow = true;
    scene.add(frontLight);

    const backLight = new THREE.SpotLight(0xffffff, 0.5);
    backLight.position.set(0, 2, -4);
    scene.add(backLight);

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    function handleResize() {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    }
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      logoGeometry.dispose();
      frameGeometry.dispose();
      frameHoleGeometry.dispose();
      logoMaterial.dispose();
      frameMaterial.dispose();
      texture.dispose();
    };
  }, [imageUrl]);

  return <div ref={containerRef} className="w-full h-[400px] relative" />;
}