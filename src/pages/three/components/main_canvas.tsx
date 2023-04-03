import { Canvas } from "@react-three/fiber"
import { PlayerCard } from "../playerCard/player_card"
import * as THREE from 'three';
import { PlayingTable } from "./playing_table";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OpponentCard } from "../opponentCard/opponent_card";
import { useState } from "react";
import { OrbitControls } from "@react-three/drei"
import { CardBox } from "./card_box";
import { playerCardDeck } from "@/utils/mocks/player_deck";

export const MainCanvas = () => {
  const isBrowser = typeof window !== 'undefined';
  const [attackOpponentCard, setAttackOpponentCard] = useState<THREE.Vector3 | null>(null)

  const positionsPlayer = [
    new THREE.Vector3(-4, -1.5, 0.1),
    new THREE.Vector3(-2, -1.5, 0.1),
    new THREE.Vector3(0, -1.5, 0.1),
    new THREE.Vector3(2, -1.5, 0.1),
    new THREE.Vector3(4, -1.5, 0.1),
  ];

  const positionsEnemy = [
    new THREE.Vector3(-4, -1.5, 0.1),
    new THREE.Vector3(-2, -1.5, 0.1),
    new THREE.Vector3(0, -1.5, 0.1),
    new THREE.Vector3(2, -1.5, 0.1),
    new THREE.Vector3(4, -1.5, 0.1),
  ];

  const playerCards = positionsPlayer.map((position, index) => (
    <PlayerCard imageUrl="/textures/card_image_placeholders/imp.png" cardIndex={index} key={index} position={position} />
  ));

  const opponentCards = positionsEnemy.map((position, index) => (
    <OpponentCard imageUrl="/textures/card_image_placeholders/horse.png" index={index} key={index} position={position} />
  ));

  return <Canvas shadows camera={{ position: [0, -5, 10], fov: 40 }}>
    <OrbitControls />
    <ambientLight intensity={0.1} />
    <directionalLight color="white" position={[0, 5, 5]} intensity={1} castShadow />
    <color attach="background" args={['#409ECA']} />

    <CardBox cards={playerCardDeck} position={[-6.2, 3.5, 0]} />
    {opponentCards}
    <PlayingTable />
    {playerCards}
    <CardBox cards={playerCardDeck} position={[6.2, -2.5, 0]} />


    {isBrowser && (
      <IsometricCamera position={[20, 20, 20]} near={0.1} far={100} aspect={window.innerWidth / window.innerHeight} />
    )}
  </Canvas>
}

function IsometricCamera(props: any) {
  const { position, near, far, aspect } = props;
  const camera = new THREE.OrthographicCamera(
    -15 * aspect,
    10 * aspect,
    10,
    -10,
    near,
    far
  );
  camera.position.copy(position);
  camera.lookAt(new THREE.Vector3());
  return <primitive object={camera} />;
}