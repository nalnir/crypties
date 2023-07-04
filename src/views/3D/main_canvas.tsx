import { Canvas } from '@react-three/fiber';
import { PlayerCard } from "./playerCard/player_card";
import * as THREE from 'three';
import { PlayingTable } from './components/playing_table';
import { OpponentCard } from "./opponentCard/opponent_card";
import { OrbitControls, PerspectiveCamera, Stats } from "@react-three/drei"
import { CardBox } from "./components/card_box";
import { playerCardDeck } from "@/utils/mocks/player_deck";
import { useEffect, useRef } from 'react';
import { Lights } from './components/lights';
import { cardBodygeometry, shapeGeometry } from './playerCard/components/geometry';
import React from 'react';
import { MotionCanvas, motion } from 'framer-motion-3d';
import { MotionConfig } from "framer-motion"

export interface CardPosition {
  x: number
  y: number
  z: number
}

export const MainCanvas = () => {
  const isBrowser = typeof window !== "undefined";
  const vector3 = new THREE.Vector3(0, 0, 0)

  // useEffect(() => {
  //   if(instancedPlayerCardRef) {
  //     instancedPlayerCardRef.current = <PlayerCard  imageUrl="/textures/card_image_placeholders/imp.png" cardBody={cardBody} cardShape={cardShape} cardIndex={0} key={0} position={initialPosition}/>
  //   }
  // },[])

  const cardShape = shapeGeometry
  const cardBody = cardBodygeometry
  const initialPlayerPosition: CardPosition = {x: 0, y: 0, z: 0}
  const initialEnemyPosition: CardPosition = { x: 0, y: -1.5, z: 0}
  const instancedPlayerCardRef = useRef(<PlayerCard  imageUrl="/textures/card_image_placeholders/imp.png" cardBody={cardBody} cardShape={cardShape} cardIndex={0} key={0} position={initialPlayerPosition}/>)
  const instancedEnemyCardRef = useRef(<OpponentCard  imageUrl="/textures/card_image_placeholders/imp.png" cardBody={cardBody} cardShape={cardShape} cardIndex={0} key={0} position={initialEnemyPosition}/>)

  const playerCardsOnTheTable : CardPosition[] = [
    {
      x: -4, y: -1.5, z: 0
    },
    {
      x: -2, y: -1.5, z: 0
    },
    {
      x: 0, y: -1.5, z: 0
    },
    {
      x: 2, y: -1.5, z: 0
    },
    {
      x: 4, y: -1.5, z: 0
    }
  ]

  const enemyCardsOnTheTable : CardPosition[] = [
    {
      x: -4, y: 1.5, z: 0
    },
    {
      x: -2, y: 1.5, z: 0
    },
    {
      x: 0, y: 1.5, z: 0
    },
    {
      x: 2, y: 1.5, z: 0
    },
    {
      x: 4, y: 1.5, z: 0
    }
  ]

  const playerCards = playerCardsOnTheTable.map((position, index) => {
    const updatedProps = {
      ...instancedPlayerCardRef.current.props,
      position: position,
      cardIndex: index,
      key: index
    };
  
    const newPlayerCardInstance = React.cloneElement(
      instancedPlayerCardRef.current,
      updatedProps
    );
  
    return newPlayerCardInstance;
    // return <PlayerCard imageUrl="/textures/card_image_placeholders/imp.png" cardBody={cardBody} cardShape={cardShape} cardIndex={index} key={index} position={position} />
  });

  const opponentCards = enemyCardsOnTheTable.map((position, index) => {
      const updatedProps = {
        ...instancedEnemyCardRef.current.props,
        position: position,
        cardIndex: index,
        key: index
      };
    
      const newEnemyCardInstance = React.cloneElement(
        instancedEnemyCardRef.current,
        updatedProps
      );
  
    return newEnemyCardInstance;
  });

  return <Canvas shadows camera={{ position: [0, 0, 10], fov: 75}}>
    <Stats />
    
    <motion.axesHelper args={[2]}/>
    <motion.gridHelper args={[30, 30]} rotation={[20.427,0,0]}/>

    <OrbitControls enableZoom={false} />
    <Lights />
    <motion.color attach="background" args={['#409ECA']} />
    <PlayingTable />

    <CardBox cards={playerCardDeck} position={[-6.2, 3.5, 0]} />
    {opponentCards}
    {playerCards}
    <CardBox cards={playerCardDeck} position={[6.2, -2.5, 0]} />
  </Canvas>
}