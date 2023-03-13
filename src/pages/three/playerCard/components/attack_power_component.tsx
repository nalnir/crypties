import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';
import { useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { BufferGeometry, Material, Mesh } from 'three';
import { TextMesh } from './health_component';

interface AttackPowerComponentProps {
    color: string;
    attackPower: number;
}
const AttackPowerComponent = ({ color, attackPower }: AttackPowerComponentProps) => {
  // rotate the orb on every frame render
  const meshRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.rotation.x += 0.02;
    }
  });

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 1);
    const edges = new THREE.EdgesGeometry(geo, 1);
    edges.rotateY(Math.PI / 4); // rotate edges by 45 degrees
    return { geo, edges };
  }, []);

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereBufferGeometry args={[1, 32, 32]} attach="geometry" />
        <meshStandardMaterial color={"#1D72A3"} metalness={3} roughness={5} transparent opacity={0.4} attach="material" />
      </mesh>
      {geometry.edges && (
        <lineSegments args={[geometry.edges]}>
          <lineBasicMaterial attach="material" color={color} linewidth={2} />
        </lineSegments>
      )}
      <mesh position={[-0.75,-0.6,0.5]}>
        <TextMesh fontPath={'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'} text={attackPower.toString()} />
        <meshPhysicalMaterial color="white" attach="material" />
      </mesh>
    </group>
  );
};

export default AttackPowerComponent;