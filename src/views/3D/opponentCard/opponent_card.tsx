import { useState } from "react";
import { Text } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { useSpring, animated } from "@react-spring/three";
import { Vector3 } from "@react-three/fiber";
import { HealthComponent } from "../playerCard/components/health_component";
import AttackPowerComponent from "../playerCard/components/attack_power_component";
import { usePlayerCardActions } from "@/recoil-state/player_cards/player_card/player_card.actions";

interface OpponentCardProps {
  imageUrl: string
  position: Vector3
  index: number
}

export const OpponentCard = ({ imageUrl, position, index }: OpponentCardProps) => {
  const texture = useTexture(imageUrl);
  const [fontLoaded, setFontLoaded] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(true);
  const playerCardActions = usePlayerCardActions();

  const [isAttacking, setIsAttacking] = useState(0);
  const [{ attack }] = useSpring({ attack: isAttacking, config: { mass: 5, tension: 1000, friction: 50, precision: 0.0001 } }, [isAttacking]);

  const pY = attack.to([0, 1], [2.5, -2.5]);

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  const roundedRectShape = new THREE.Shape();
  const x = -1.25;
  const y = 0.9;
  const width = 2.5;
  const height = 1.8;
  const radius = 0.025;

  roundedRectShape.moveTo(x + radius, y);
  roundedRectShape.lineTo(x + width - radius, y);
  roundedRectShape.quadraticCurveTo(x + width, y, x + width, y + radius);
  roundedRectShape.lineTo(x + width, y + height - radius);
  roundedRectShape.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );
  roundedRectShape.lineTo(x + radius, y + height);
  roundedRectShape.quadraticCurveTo(x, y + height, x, y + height - radius);
  roundedRectShape.lineTo(x, y + radius);
  roundedRectShape.quadraticCurveTo(x, y, x + radius, y);

  const extrudeSettings = {
    steps: 1,
    depth: 0.1,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 2,
  };

  const cardWidth = 3;
  const cardHeight = 4;
  const cardDepth = 0.1;

  const shapeGeometry = new THREE.ExtrudeGeometry(roundedRectShape, extrudeSettings);

  const cardBodyradius = 50; // Adjust the corner radius as needed
  const cardBodygeometry = new RoundedBoxGeometry(cardWidth, cardHeight, cardDepth, cardBodyradius);

  const handleCardAttack = () => {
    playerCardActions.attackCard(position);
  };


  return (
    <animated.mesh position-z={position instanceof THREE.Vector3 ? position.z : 0} position-x={position instanceof THREE.Vector3 ? position.x : 0} position-y={pY} castShadow scale={[0.5, 0.5, 0.5]} onClick={handleCardAttack}>
      {/* Card body */}
      <mesh position={[0, 0, 0.1]} castShadow>
        <bufferGeometry attach="geometry" {...cardBodygeometry} />
        <meshBasicMaterial attach="material" color={"#51CF66"} />
        <meshPhongMaterial attach="material" color="#51CF66" />
      </mesh>

      <mesh position={[1.1, 1.4, 0.15]} scale={[0.3, 0.40, 0.1]} castShadow>
        <HealthComponent cardHealth={7} />
      </mesh>

      <mesh position={[1.1, 0.6, 0.15]} scale={[0.3, 0.40, 0.1]} castShadow>
        <AttackPowerComponent color='' attackPower={10} />
      </mesh>

      {/* Rounded border */}
      {imageLoaded && (
        <mesh position={[0, -1.04, 0.1]} scale-z={0.4} castShadow>
          <bufferGeometry attach="geometry" {...shapeGeometry} />
          <meshPhongMaterial attach="material" color={"#3D8F47"} />
        </mesh>
      )}

      {/* Image */}
      {imageLoaded && (
        <mesh position={[0, 0.75, 0.21]}>
          <planeGeometry attach="geometry" args={[2.5, 1.8]} />
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
      )}

      {/* Text */}
      {fontLoaded && (
        <mesh position={[0, -1.5, 0.3]} castShadow>
          <Text fontSize={0.4} color={"#3D8F47"} font={""}>
            {"UNICORN"}
          </Text>
        </mesh>
      )}
    </animated.mesh>
  );
};