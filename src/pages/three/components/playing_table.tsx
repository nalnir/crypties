import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

export const PlayingTable = () => {

    const tableWidth = 12;
    const tableHeight = 3;
    const tableDepth = 0.5;
  
    const tableBodyradius = 50; // Adjust the corner radius as needed
    const tableBodygeometry = new RoundedBoxGeometry(tableWidth, tableHeight, tableDepth, tableBodyradius);

    return <mesh position={[0, 1, -1]} castShadow>
        <bufferGeometry attach="geometry" {...tableBodygeometry}/>
        <meshBasicMaterial attach="material" color={"#FFDB58"} />
        <meshPhongMaterial attach="material" color="#FFDB58" />
    </mesh>
}