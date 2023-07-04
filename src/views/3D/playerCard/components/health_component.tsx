import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { TextBufferGeometry, TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { extend, useFrame } from '@react-three/fiber'

extend({ TextGeometry })

import { useLoader } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useTexture } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

interface HealthComponentProps {
  cardHealth: number;
  shape: THREE.Shape;
}

export const HealthComponent = ({ cardHealth, shape }: HealthComponentProps) => {
  const diamondShape = useMemo(() => {
    const currentShape = shape
    currentShape.moveTo(0, 1)
    currentShape.lineTo(1, 0)
    currentShape.lineTo(0, -1)
    currentShape.lineTo(-1, 0)
    currentShape.lineTo(0, 1)
    return currentShape
  }, [])

  const extrudeSettings = useMemo(() => {
    return {
      steps: 2,
      depth: 1.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 5
    }
  }, [])

  return (
    <motion.group>
      <motion.mesh>
        <motion.extrudeBufferGeometry args={[diamondShape, extrudeSettings]} attach="geometry" />
        <motion.meshStandardMaterial color={"#E61E25"} metalness={3} roughness={5} transparent opacity={0.5} attach="material" />
      </motion.mesh>
      <motion.mesh position={[-0.3, -0.6, 0.8]}>
        <TextMesh fontPath={'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json'} text={cardHealth.toString()} />
        <motion.meshPhysicalMaterial color="white" attach="material" />
      </motion.mesh>
    </motion.group>
  )
};

interface TextMeshProps {
  text: string,
  fontPath: string
}
export function TextMesh({ text, fontPath }: TextMeshProps) {
  const font = useLoader(FontLoader, fontPath);
  const geometry = new TextGeometry(text, {
    font: font,
    size: 1,
    height: 0.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelSegments: 5,
  });
  geometry.computeBoundingBox();
  return (
    <motion.mesh>
      <motion.bufferGeometry attach="geometry" {...geometry} />
      <motion.meshStandardMaterial attach="material" />
    </motion.mesh>
  );
}