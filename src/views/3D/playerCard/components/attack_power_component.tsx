import * as THREE from 'three';
import { useFrame } from 'react-three-fiber';
import { useMemo, useRef } from 'react';
import { useTexture } from '@react-three/drei';
import { BufferGeometry, Material, Mesh } from 'three';
import { TextMesh } from './health_component';
import { motion } from 'framer-motion-3d';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

interface AttackPowerComponentProps {
    color: string;
    attackPower: number;
    shape: THREE.IcosahedronGeometry;
}
const AttackPowerComponent = ({ color, attackPower, shape }: AttackPowerComponentProps) => {

  const currentGeometry = useMemo(() => {
    const geo = shape;
    const edges = new THREE.EdgesGeometry(geo, 1);
    edges.rotateY(Math.PI / 4); // rotate edges by 45 degrees
    return { geo, edges };
  }, []);

  return (
    <motion.group>
      <motion.mesh>
        <motion.sphereBufferGeometry args={[1, 32, 32]} attach="geometry" />
        <motion.meshStandardMaterial color={"#1D72A3"} metalness={3} roughness={5} transparent opacity={0.4} attach="material" />
      </motion.mesh>
      {currentGeometry.edges && (
        <motion.lineSegments args={[currentGeometry.edges]}>
          <motion.lineBasicMaterial attach="material" color={color} linewidth={2} />
        </motion.lineSegments>
      )}
      <motion.mesh position={[-0.75,-0.6,0.5]}>
        <TextMesh fontPath={'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'} text={attackPower.toString()} />
        <motion.meshPhysicalMaterial color="white" attach="material" />
      </motion.mesh>
    </motion.group>
  );
};

export default AttackPowerComponent;