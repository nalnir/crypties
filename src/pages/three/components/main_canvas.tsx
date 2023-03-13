import { Canvas } from "@react-three/fiber"
import { PlayerCard } from "../playerCard/player_card"
import * as THREE from 'three';
import { PlayingTable } from "./playing_table";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OpponentCard } from "../opponentCard/opponent_card";
import { useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei"
import { usePlayerCardActions } from "@/recoil-state/player_card_state/player_card.actions";

export const MainCanvas = () => {
    const isBrowser = typeof window !== 'undefined';
    const playerCardActions = usePlayerCardActions();
    const isPicked = useRef<number | null>(null);
    const [attackOpponentCard, setAttackOpponentCard] = useState< THREE.Vector3 | null>(null)

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

    const handleCardPick = (index: number | null) => {
      if(isPicked.current === index) {
        playerCardActions.pickCard(null)
      } else {
        playerCardActions.pickCard(index)
      }
    }

    const handleCardAttack = (index: number) => {
      if(isPicked) {
        setAttackOpponentCard(positionsEnemy[index])
      }
    }

    const playerCards = positionsPlayer.map((position, index) => (
        <PlayerCard attackOpponentCard={attackOpponentCard} cardIndex={index} key={index} position={position} handleCardPick={(index) => handleCardPick(index)}/>
    ));

    const opponentCards = positionsEnemy.map((position, index) => (
      <OpponentCard index={index} key={index} position={position} handleCardAttack={(index) => handleCardAttack(index)}/>
  ));
    
    return <Canvas shadows camera={{ position: [0, -5, 10], fov: 40 }}>
        <OrbitControls />
        <ambientLight intensity={0.1} />
        <directionalLight color="white" position={[0, 5, 5]} intensity={1} castShadow />
        <color attach="background" args={['#409ECA']} />
        {opponentCards}
        <PlayingTable />
        {/* {playerCards} */}
        {positionsPlayer.map((position, index) => {
          return <PlayerCard attackOpponentCard={attackOpponentCard} cardIndex={index} key={index} position={position} handleCardPick={(index) => handleCardPick(index)} />;
        })}
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