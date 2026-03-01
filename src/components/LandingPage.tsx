import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

const PAPER_WIDTH = 5;
const PAPER_HEIGHT = 3.5;

const FallingPaper = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const scroll = useScroll();
  
  const originalPositions = useRef<Float32Array | null>(null);

  useEffect(() => {
    if (geomRef.current) {
      originalPositions.current = (geomRef.current.attributes.position.array as Float32Array).slice();
    }
  }, []);

  useFrame(() => {
    if (!meshRef.current || !geomRef.current || !originalPositions.current) return;
    
    const progress = Math.min(Math.max(scroll.offset / (1.5/10), 0), 1); 
    
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
      <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={0.7} />
    </mesh>
  );
};

const FallingLayer = ({ startScroll, endScroll, yOffset, children }: { startScroll: number, endScroll: number, yOffset: number, children: React.ReactNode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame(() => {
    if (!groupRef.current) return;
    const rawScroll = scroll.offset;
    
    groupRef.current.visible = rawScroll >= startScroll - 0.001;
    if (!groupRef.current.visible) return;

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

const greatVibes = `https://db.onlinewebfonts.com/t/5bf06596a053153248631d74f9fc4e28.woff`;

const Scene = () => {
  const BORDER_WIDTH = 0.02;
  const BORDER_COLOR = "#a2996e";

  return (
    <>
      {/* Paper Drop: 0 to 1.5/10 */}
      <FallingPaper />

      {/* 1. Inner Decoration/Tint & Elegant Border */}
      <FallingLayer startScroll={1.5/10} endScroll={2.1/10} yOffset={0.01}>
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[PAPER_WIDTH - 0.2, PAPER_HEIGHT - 0.2]} />
          <meshStandardMaterial color="#f4eb74" transparent opacity={0.4} />
        </mesh>
        {/* Borders */}
        <mesh position={[0, (PAPER_HEIGHT - 0.2) / 2 - BORDER_WIDTH / 2, 0.002]}>
            <planeGeometry args={[PAPER_WIDTH - 0.2, BORDER_WIDTH]} />
            <meshStandardMaterial color={BORDER_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -(PAPER_HEIGHT - 0.2) / 2 + BORDER_WIDTH / 2, 0.002]}>
            <planeGeometry args={[PAPER_WIDTH - 0.2, BORDER_WIDTH]} />
            <meshStandardMaterial color={BORDER_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[(PAPER_WIDTH - 0.2) / 2 - BORDER_WIDTH / 2, 0, 0.002]}>
            <planeGeometry args={[BORDER_WIDTH, PAPER_HEIGHT - 0.2]} />
            <meshStandardMaterial color={BORDER_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-(PAPER_WIDTH - 0.2) / 2 + BORDER_WIDTH / 2, 0, 0.002]}>
            <planeGeometry args={[BORDER_WIDTH, PAPER_HEIGHT - 0.2]} />
            <meshStandardMaterial color={BORDER_COLOR} metalness={0.6} roughness={0.4} />
        </mesh>
      </FallingLayer>

      {/* 2. Subtle Background Pattern */}
      <FallingLayer startScroll={2.1/10} endScroll={2.7/10} yOffset={0.011}>
        <group>
          {Array.from({ length: 10 }).map((_, i) =>
            Array.from({ length: 15 }).map((__, j) => (
              <mesh
                key={i * 15 + j}
                position={[
                  -PAPER_WIDTH / 2 + 0.3 + j * 0.3,
                  -PAPER_HEIGHT / 2 + 0.3 + i * 0.3,
                  0.001
                ]}
              >
                <circleGeometry args={[0.005, 8]} />
                <meshStandardMaterial color="#000000" transparent opacity={0.05} />
              </mesh>
            ))
          )}
        </group>
      </FallingLayer>
      
      {/* 3. Top Left Triangle (Coral) */}
      <FallingLayer startScroll={2.7/10} endScroll={3.3/10} yOffset={0.002}>
        <mesh position={[-PAPER_WIDTH/2 + 0.6, PAPER_HEIGHT/2 - 0.5, 0.05]} rotation={[0, 0, Math.PI / 3]}>
          <planeGeometry args={[1, 1]} />
          <meshStandardMaterial color="#eb425b" />
        </mesh>
      </FallingLayer>

      {/* 4. Top Right Squares (Mustard & Pink) */}
      <FallingLayer startScroll={3.3/10} endScroll={3.9/10} yOffset={0.012}>
        <mesh position={[PAPER_WIDTH/2 - 1, PAPER_HEIGHT/2 - 0.4, 0.005]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial color="#ffd83c" />
        </mesh>
        <mesh position={[PAPER_WIDTH/2 - 0.7, PAPER_HEIGHT/2 - 0.4, 0.005]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial color="#ff0026" opacity={0.6} transparent />
        </mesh>
      </FallingLayer>

      {/* 5. Bottom Left Circle (Navy) */}
      <FallingLayer startScroll={3.9/10} endScroll={4.5/10} yOffset={0.007}>
        <mesh position={[-PAPER_WIDTH/2 + 0.6, -PAPER_HEIGHT/2 + 0.6, 0.005]}>
          <circleGeometry args={[0.4, 32]} />
          <meshStandardMaterial color="#020d88" />
        </mesh>
      </FallingLayer>

      {/* 6. Thematic Icon (Seal) */}
      <FallingLayer startScroll={4.5/10} endScroll={5.1/10} yOffset={0.009}>
        <group position={[PAPER_WIDTH/2 - 0.6, -PAPER_HEIGHT/2 + 0.6, 0.005]}>
            <mesh>
                <circleGeometry args={[0.3, 32]} />
                <meshStandardMaterial color="#cda434" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0,0,0.001]}>
                <circleGeometry args={[0.25, 32]} />
                <meshStandardMaterial color="#a2996e" metalness={0.8} roughness={0.3} />
            </mesh>
        </group>
      </FallingLayer>

      {/* 7. Side Pattern (Dots) */}
      <FallingLayer startScroll={5.1/10} endScroll={5.7/10} yOffset={0.008}>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[PAPER_WIDTH/2 - 0.2, -0.5 + i * 0.2, 0.005]}>
            <circleGeometry args={[0.03, 16]} />
            <meshStandardMaterial color="#0015f7" />
          </mesh>
        ))}
      </FallingLayer>

      {/* --- NEW TEXT LAYERS --- */}

      {/* Text Layer 1: Title */}
      <FallingLayer startScroll={5.7/10} endScroll={6.7/10} yOffset={0.02}>
        <Text
          position={[0, 1, 0.01]}
          fontSize={0.8}
          color="#222222"
          font={greatVibes}
          anchorX="center"
          anchorY="middle"
        >
          Certificate
        </Text>
      </FallingLayer>

      {/* Text Layer 2: Recipient */}
      <FallingLayer startScroll={6.2/10} endScroll={7.7/10} yOffset={0.025}>
        <Text
          position={[0, 0.4, 0.01]}
          fontSize={0.15}
          color="#444444"
          anchorX="center"
          anchorY="middle"
        >
          This certificate is proudly presented to
        </Text>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.6}
          color="#0015f7"
          font={greatVibes}
          anchorX="center"
          anchorY="middle"
        >
          Akshay Kumar
        </Text>
      </FallingLayer>

      {/* Text Layer 3: Reason */}
      <FallingLayer startScroll={6.7/10} endScroll={8.2/10} yOffset={0.03}>
        <Text
          position={[0, -0.5, 0.01]}
          fontSize={0.12}
          color="#555555"
          maxWidth={PAPER_WIDTH - 1.5}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
        >
          For outstanding contributions and excellence in the coordination of the Annual Tech Summit 2026.
        </Text>
      </FallingLayer>
      
      {/* Text Layer 4: Signatures & Date */}
      <FallingLayer startScroll={7.2/10} endScroll={9.0/10} yOffset={0.035}>
          {/* Signature 1 */}
          <mesh position={[-1, -1.2, 0.01]}>
              <planeGeometry args={[1.5, 0.01]} />
              <meshStandardMaterial color="#333333" />
          </mesh>
          <Text position={[-1, -1.3, 0.01]} fontSize={0.1} color="#333333" anchorX="center">
              Jane Doe, CEO
          </Text>

          {/* Signature 2 */}
          <mesh position={[1, -1.2, 0.01]}>
              <planeGeometry args={[1.5, 0.01]} />
              <meshStandardMaterial color="#333333" />
          </mesh>
          <Text position={[1, -1.3, 0.01]} fontSize={0.1} color="#333333" anchorX="center">
              John Smith, Director
          </Text>
          
          <Text position={[0, -1.55, 0.01]} fontSize={0.08} color="#666666" anchorX="center">
              Issued on: March 1st, 2026
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
        camera={{ position: [10, 10, 12], fov: 25 }}
        onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1.8} castShadow shadow-bias={-0.0001} />
        <directionalLight position={[-10, 10, -10]} intensity={0.7} color="#e0e7ff" />
        
        <ScrollControls pages={10} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
      <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', background: 'rgba(252, 252, 252, 0.8)', padding: '10px 20px', borderRadius: '8px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>Scroll down to see the drop & print ↓</h2>
      </div>
    </div>
  );
};

export default LandingPage;