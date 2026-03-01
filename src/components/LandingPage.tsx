import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

const PAPER_WIDTH = 3.5;
const PAPER_HEIGHT = 5;

const FallingPaper = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const scroll = useScroll();
  
  const originalPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (geomRef.current) {
      originalPositions.current = geomRef.current.attributes.position.array.slice();
    }
  }, []);

  useFrame((state) => {
    if (!meshRef.current || !geomRef.current || !originalPositions.current) return;
    
    const progress = Math.min(Math.max(scroll.offset / (3/9), 0), 1); 
    
    const positions = geomRef.current.attributes.position.array as Float32Array;
    const orig = originalPositions.current;
    
    const fallingSpeed = Math.sin(progress * Math.PI); 
    
    let impactFold = 0;
    if (progress > 0.8 && progress < 1.0) {
      impactFold = Math.max(0, 1 - Math.abs(progress - 0.9) / 0.1);
    }

    for (let i = 0; i < positions.length; i += 3) {
      const x = orig[i];
      const y = orig[i+1];
      
      const bend = x * x * 0.08 * fallingSpeed;
      const twist = x * y * 0.02 * fallingSpeed;
      const fold = (y < -1 ? (y + 1) * (y + 1) * 0.3 : 0) * impactFold;
      
      positions[i+2] = orig[i+2] + bend + twist + fold;
    }
    
    geomRef.current.attributes.position.needsUpdate = true;
    geomRef.current.computeVertexNormals(); 

    const dropEase = Math.pow(progress, 1.2); 
    const yBase = 12 * (1 - dropEase);
    
    const swayX = Math.sin(progress * Math.PI * 5) * 4 * (1 - progress);
    const swayZ = Math.cos(progress * Math.PI * 4) * 3 * (1 - progress);
    
    meshRef.current.position.set(swayX, yBase, swayZ);
    
    const targetRotX = -Math.PI / 2; 
    const flattenProgress = Math.pow(progress, 3); 
    const currentBaseX = THREE.MathUtils.lerp(Math.PI / 3, targetRotX, flattenProgress);
    
    const flipFlopX = Math.sin(progress * Math.PI * 6) * 0.8 * (1 - progress);
    const wobbleZ = Math.cos(progress * Math.PI * 7) * 0.6 * (1 - progress);
    const targetRotY = Math.PI * 2;
    const currentBaseY = THREE.MathUtils.lerp(0, targetRotY, progress) + Math.sin(progress * Math.PI * 3) * 0.5 * (1 - progress);
    
    meshRef.current.rotation.set(
      currentBaseX + flipFlopX,
      currentBaseY,
      wobbleZ
    );
    
    meshRef.current.updateMatrixWorld();
    
    let minY = Infinity;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positions.length; i += 3) {
      vertex.set(positions[i], positions[i+1], positions[i+2]);
      vertex.applyMatrix4(meshRef.current.matrixWorld);
      if (vertex.y < minY) minY = vertex.y;
    }

    if (minY < 0.01) {
      meshRef.current.position.y += (0.01 - minY);
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <planeGeometry ref={geomRef} args={[PAPER_WIDTH, PAPER_HEIGHT, 24, 24]} />
      <meshStandardMaterial color="#fdfbf7" side={THREE.DoubleSide} roughness={0.9} />
    </mesh>
  );
};

const FallingLayer = ({ startScroll, endScroll, yOffset, children }: { startScroll: number, endScroll: number, yOffset: number, children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const rawScroll = scroll.offset;
    
    if (rawScroll < startScroll - 0.001) {
       groupRef.current.visible = false;
       return;
    }
    groupRef.current.visible = true;

    const progress = Math.min(Math.max((rawScroll - startScroll) / (endScroll - startScroll), 0), 1);
    
    const dropEase = Math.pow(progress, 1.2); 
    const yBase = 12 * (1 - dropEase) + yOffset;
    
    const swayVariance = yOffset * 50; 
    const swayX = Math.sin(progress * Math.PI * 5 + swayVariance) * 4 * (1 - progress);
    const swayZ = Math.cos(progress * Math.PI * 4 + swayVariance) * 3 * (1 - progress);
    
    groupRef.current.position.set(swayX, yBase, swayZ);
    
    const targetRotX = -Math.PI / 2; 
    const flattenProgress = Math.pow(progress, 3); 
    const currentBaseX = THREE.MathUtils.lerp(Math.PI / 3, targetRotX, flattenProgress);
    
    const flipFlopX = Math.sin(progress * Math.PI * 6 + swayVariance) * 0.8 * (1 - progress);
    const wobbleZ = Math.cos(progress * Math.PI * 7 + swayVariance) * 0.6 * (1 - progress);
    const targetRotY = Math.PI * 2;
    const currentBaseY = THREE.MathUtils.lerp(0, targetRotY, progress) + Math.sin(progress * Math.PI * 3 + swayVariance) * 0.5 * (1 - progress);
    
    groupRef.current.rotation.set(
      currentBaseX + flipFlopX,
      currentBaseY,
      wobbleZ
    );
  });

  return (
    <group ref={groupRef} castShadow receiveShadow>
      {children}
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-bias={-0.0001} />
      <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#e0e7ff" />
      
      {/* Paper Drop: 0 to 3/9 */}
      <FallingPaper />
      
      {/* Border Drop: 3/9 to 5/9 */}
      <FallingLayer startScroll={3/9} endScroll={5/9} yOffset={0.01}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[PAPER_WIDTH - 0.4, PAPER_HEIGHT - 0.4]} />
          <meshStandardMaterial color="#333333" transparent opacity={0.1} wireframe />
        </mesh>
      </FallingLayer>

      {/* Name Drop: 5/9 to 7/9 */}
      <FallingLayer startScroll={5/9} endScroll={7/9} yOffset={0.02}>
        <Text
          position={[0, 1.0, 0]}
          fontSize={0.4}
          color="#333333"
          anchorX="center"
          anchorY="middle"
        >
          Certificate
        </Text>
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color="#111111"
          anchorX="center"
          anchorY="middle"
        >
          John Doe
        </Text>
      </FallingLayer>

      {/* Details Drop: 7/9 to 9/9 */}
      <FallingLayer startScroll={7/9} endScroll={9/9} yOffset={0.03}>
        <Text
          position={[0, -1.0, 0]}
          fontSize={0.15}
          color="#555555"
          maxWidth={PAPER_WIDTH - 1}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          For outstanding dedication, passion, and excellence in Event Coordination. 
          Your contributions have been invaluable.
        </Text>
      </FallingLayer>
      
      <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={20} blur={2} far={10} color="#000000" />
    </>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <Canvas 
        shadows 
        camera={{ position: [10, 10, 10], fov: 35 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ScrollControls pages={9} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', background: 'rgba(255,255,255,0.8)', padding: '10px 20px', borderRadius: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Scroll down to see the drop & print ↓</h2>
      </div>
    </div>
  );
};

export default LandingPage;