import { useState } from "react";
import { Text, TransformControls } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { useSpring, animated } from "@react-spring/three";
import { Vector3 } from "@react-three/fiber";
import { HealthComponent } from "../playerCard/components/health_component";
import AttackPowerComponent from "../playerCard/components/attack_power_component";
import { usePlayerCardActions } from "@/recoil-state/player_cards/player_card/player_card.actions";
import { CardPosition } from "../main_canvas";
import { motion } from "framer-motion-3d";
import { attackPowerComponentShape, healthComponentShape } from "../playerCard/components/geometry";

interface OpponentCardProps {
  imageUrl: string
  cardIndex: number;
  position: CardPosition;
  cardShape: THREE.ExtrudeGeometry;
  cardBody: RoundedBoxGeometry; 
}

export const OpponentCard = ({ imageUrl, position, cardIndex, cardShape, cardBody }: OpponentCardProps) => {
  const texture = useTexture(imageUrl);
  const [fontLoaded, setFontLoaded] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true);
  const playerCardActions = usePlayerCardActions();

  const [isAttacking, setIsAttacking] = useState(0);
  const [{ attack }] = useSpring({ attack: isAttacking, config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 } }, [isAttacking]);

  const pY = attack.to([0, 1], [2.5, -2.5]);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  const handleCardAttack = () => {
    playerCardActions.attackCard(position);
  };


  return (
    <motion.group position={[position.x,position.y,position.z]} castShadow scale={[0.45, 0.5, 0.5]} onClick={handleCardAttack}>
      {/* Card body */}
      <motion.mesh position={[0, 0, 0.1]} castShadow>
        <motion.bufferGeometry attach="geometry" {...cardBody} />
        <motion.meshToonMaterial attach="material" color={"#51CF66"} />
        <motion.meshPhongMaterial attach="material" color="#51CF66" />
      </motion.mesh>

      <motion.mesh position={[1.1, 1.4, 0.15]} scale={[0.3, 0.40, 0.1]} castShadow>
        <HealthComponent shape={healthComponentShape} cardHealth={7} />
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