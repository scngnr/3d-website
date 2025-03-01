'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSG } from 'three-csg-ts';

interface LogoPreview3DProps {
  imageUrl: string;
  width?: number;
  height?: number;
  glowColor: string;
  glowIntensity: number;
}

export default function LogoPreview3D({ imageUrl, width = 0, height = 0, glowColor = '#00ffff', glowIntensity = 1.5 }: LogoPreview3DProps) {
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
    
    // Create a canvas to analyze the image and detect text areas
    const analyzeImage = () => {
      const tempImg = new Image();
      tempImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = tempImg.width;
        canvas.height = tempImg.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.drawImage(tempImg, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Create a new canvas for the glowing text
        const glowCanvas = document.createElement('canvas');
        glowCanvas.width = tempImg.width;
        glowCanvas.height = tempImg.height;
        const glowCtx = glowCanvas.getContext('2d');
        if (!glowCtx) return;
        
        // Draw the original image
        glowCtx.drawImage(tempImg, 0, 0);
        
        // Apply edge detection and color analysis to detect both text and drawing elements
        const edgeThreshold = 30; // Threshold for edge detection
        const colorThreshold = 100; // Threshold for color detection
        
        // Create arrays for edge detection
        const width = canvas.width;
        const height = canvas.height;
        
        // Function to get pixel index
        const getIndex = (x: number, y: number) => (y * width + x) * 4;
        
        // Process each pixel
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = getIndex(x, y);
            
            // Get current pixel values
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            
            // Skip transparent pixels
            if (a < 200) continue;
            
            // Calculate brightness
            const brightness = (r + g + b) / 3;
            
            // Check surrounding pixels for edges
            const leftIdx = getIndex(x - 1, y);
            const rightIdx = getIndex(x + 1, y);
            const topIdx = getIndex(x, y - 1);
            const bottomIdx = getIndex(x, y + 1);
            
            const leftBrightness = (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3;
            const rightBrightness = (data[rightIdx] + data[rightIdx + 1] + data[rightIdx + 2]) / 3;
            const topBrightness = (data[topIdx] + data[topIdx + 1] + data[topIdx + 2]) / 3;
            const bottomBrightness = (data[bottomIdx] + data[bottomIdx + 1] + data[bottomIdx + 2]) / 3;
            
            // Calculate edge intensity
            const edgeIntensity = Math.max(
              Math.abs(brightness - leftBrightness),
              Math.abs(brightness - rightBrightness),
              Math.abs(brightness - topBrightness),
              Math.abs(brightness - bottomBrightness)
            );
            
            // Apply glow if pixel is part of text or drawing
            if (brightness < colorThreshold || edgeIntensity > edgeThreshold) {
              // Make it glow with the selected color
              const hexColor = glowColor.replace('#', '');
              const newR = parseInt(hexColor.substring(0, 2), 16);
              const newG = parseInt(hexColor.substring(2, 4), 16);
              const newB = parseInt(hexColor.substring(4, 6), 16);
              
              // Set the pixel to the glow color
              data[idx] = newR;
              data[idx + 1] = newG;
              data[idx + 2] = newB;
            }
          }
        }
        
        // Put the modified image data back
        glowCtx.putImageData(imageData, 0, 0);
        
        // Create a new texture from the modified canvas
        const glowTexture = new THREE.CanvasTexture(glowCanvas);
        glowTexture.colorSpace = 'srgb';
        
        // Update the material with the glow texture
        createGlowingLogoMaterial(texture, glowTexture);
      };
      tempImg.src = imageUrl;
    };
    
    analyzeImage();

    // Create materials
    const createGlowingLogoMaterial = (baseTexture: THREE.Texture, glowTexture: THREE.Texture) => {
      // Base material with the original texture
      const logoMaterial = new THREE.MeshStandardMaterial({
        map: baseTexture,
        side: THREE.DoubleSide,
        metalness: 0.3,
        roughness: 0.7
      });
      
      // Create a glowing material for text parts
      const glowMaterial = new THREE.MeshStandardMaterial({
        map: glowTexture,
        side: THREE.DoubleSide,
        transparent: true,
        emissive: new THREE.Color(glowColor),
        emissiveMap: glowTexture,
        emissiveIntensity: glowIntensity
      });
      
      // Create the logo mesh with the base material
      createLogoMeshes(logoMaterial, glowMaterial);
    };
    
    // Default material until analysis completes
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

    // Function to create logo meshes
    const createLogoMeshes = (baseMaterial: THREE.Material, glowMaterial: THREE.Material) => {
      // Remove existing logo mesh if any
      scene.traverse((object) => {
        if (object.name === 'logoGroup') {
          scene.remove(object);
        }
      });
      
      // Create base logo mesh
      const logoMesh = new THREE.Mesh(logoGeometry, baseMaterial);
      logoMesh.position.z = -0.01; // Slightly behind frame
      
      // Create glowing text mesh (slightly in front of the base)
      const glowMesh = new THREE.Mesh(logoGeometry, glowMaterial);
      glowMesh.position.z = 0.01; // Slightly in front
      
      // Create group for all logo elements
      const logoGroup = new THREE.Group();
      logoGroup.name = 'logoGroup';
      logoGroup.add(logoMesh);
      logoGroup.add(glowMesh);
      
      // Create group for logo and frame
      const signGroup = new THREE.Group();
      signGroup.add(finalFrame);
      signGroup.add(logoGroup);
      signGroup.rotation.x = -0.2; // Tilt slightly back
      scene.add(signGroup);
      
      // Add pulsing animation to the glow
      const pulseGlow = () => {
        const time = Date.now() * 0.001; // Convert to seconds
        const pulse = Math.sin(time * 2) * 0.5 + 1; // Oscillate between 0.5 and 1.5
        
        if (glowMaterial instanceof THREE.MeshStandardMaterial) {
          glowMaterial.emissiveIntensity = glowIntensity * pulse;
        }
      };
      
      // Update animation function
      animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        pulseGlow();
        renderer.render(scene, camera);
      };
      animate();
    };
    
    // Initial logo mesh until analysis completes
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
    let animate = function() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
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
  }, [imageUrl, glowColor, glowIntensity, width, height]);

  return (
    <div ref={containerRef} className="w-full h-[400px] relative" />
  );
}