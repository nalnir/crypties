import { Ref, useEffect, useRef, useState } from 'react';
import { Text, useAnimations } from '@react-three/drei';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';
import { useSpring, animated, config } from '@react-spring/three';
import { useFrame, Vector3 } from '@react-three/fiber';
import { HealthComponent } from './components/health_component';
import AttackPowerComponent from './components/attack_power_component';
import { BufferGeometry, Mesh } from 'three';
import { useRecoilValue } from 'recoil';
import { playerCardAtom } from '@/recoil-state/player_cards/player_card/player_card.atom';
import { usePlayerCardActions } from '@/recoil-state/player_cards/player_card/player_card.actions';
import useStateCallback from '@/utils/hooks/use_state_callback';
import { CardPosition } from '../main_canvas';

import { motion } from "framer-motion-3d"
import { useAnimation } from "framer-motion"
import { attackPowerComponentShape, healthComponentShape } from './components/geometry';

interface PlayergCardProps {
  imageUrl: string
  cardIndex: number;
  position: CardPosition;
  cardShape: THREE.ExtrudeGeometry;
  cardBody: RoundedBoxGeometry; 
}

export const PlayerCard = ({ imageUrl, position, cardIndex, cardShape, cardBody }: PlayergCardProps) => {
  const texture = useTexture(imageUrl);
  const [fontLoaded, setFontLoaded] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true);
  const playerCardState = useRecoilValue(playerCardAtom);
  const playerCardActions = usePlayerCardActions();
  const animationControls = useAnimation();

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  const [isAttacking, setIsAttacking] = useStateCallback(false)

  useEffect(() => {
    if (playerCardState.isPicked === cardIndex) {
      animatePickCard(0.5)
    } else {
      animatePickCard(0)
    }
  }, [playerCardState.isPicked])

  const animatePickCard = async (z: number) => {
    await animationControls.start({ z: z }, { duration: 0.5 } );
  }

  useEffect(() => {
    const enemyPosition = playerCardState.attackingCard
    if (playerCardState.isPicked === cardIndex && enemyPosition) {
      animateAttack(enemyPosition?.x, enemyPosition?.y, enemyPosition?.z, true)
    } else {
      animateAttack(position.x, position.y, position.z, false)
    }
  }, [playerCardState.attackingCard])

  const animateAttack = async (x: number, y: number, z: number, setInitial: boolean) => {
    await animationControls.start({ x: x, y: y, z: z}, { duration: 0.5 });
    if(setInitial) {
      playerCardActions.attackCard(null)
      playerCardActions.pickCard(null)
    }
  }

  function handleClick() {
    playerCardActions.pickCard(cardIndex)
  }

  return (
  <motion.group animate={animationControls} whileHover={{scale: 0.5}} position={[position.x,position.y,position.z]} scale={[0.45, 0.5, 0.5]} onClick={handleClick}>
      {/* Card body */}
      <motion.mesh position={[0, 0, 0.1]} castShadow>
        <motion.bufferGeometry attach="geometry" {...cardBody} />
        <motion.meshBasicMaterial attach="material" color={"#51CF66"} />
        <motion.meshPhongMaterial attach="material" color={"#51CF66"} />
      </motion.mesh>

      <motion.mesh position={[1.1, 1.4, 0.15]} scale={[0.3, 0.40, 0.1]} castShadow>
        <HealthComponent cardHealth={7} shape={healthComponentShape} />
      </motion.mesh>

      <motion.mesh position={[1.1, 0.6, 0.15]} scale={[0.3, 0.40, 0.1]} castShadow>
        <AttackPowerComponent color='' attackPower={10} shape={attackPowerComponentShape} />
      </motion.mesh>

      {/* Rounded border */}
      {imageLoaded && (
        <motion.mesh position={[0, -1.04, 0.1]} scale-z={0.4} castShadow>
          <motion.bufferGeometry attach="geometry" {...cardShape} />
          <motion.meshPhongMaterial attach="material" color={"#3D8F47"} />
        </motion.mesh>
      )}

      {/* Image */}
      {imageLoaded && (
        <motion.mesh position={[0, 0.75, 0.21]}>
          <motion.planeGeometry attach="geometry" args={[2.5, 1.8]} />
          <motion.meshBasicMaterial attach="material" map={texture} />
        </motion.mesh>
      )}

      {/* Text */}
      {fontLoaded && (
        <motion.mesh position={[0, -1.5, 0.3]} castShadow>
          <Text fontSize={0.4} color={"#3D8F47"} font={""}>
            {"UNICORN"}
          </Text>
        </motion.mesh>
      )}
      </motion.group>
  );
};

