import * as THREE from 'three';
import { useRef } from "react";
import { useHelper } from '@react-three/drei';
import { motion } from 'framer-motion-3d';

export const Lights = () => {
    const ligthRef = useRef<THREE.DirectionalLight>()
    

    // useHelper(ligthRef, THREE.DirectionalLightHelper, 2, "red");

    return (
        <>
            <ambientLight intensity={0.15} />
            <directionalLight 
                scale={[10,10,20]}
                // ref={ligthRef} 
                color="white" 
                position={[5, 6, 7]} 
                intensity={1} 
                castShadow 
            />
            <hemisphereLight args={['#322e9b', '#22c970', 0.4]}/>
        </>
    );
}