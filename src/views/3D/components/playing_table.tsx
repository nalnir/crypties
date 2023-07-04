import { motion } from 'framer-motion-3d';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry';

export const PlayingTable = () => {

    const tableWidth = 20;
    const tableHeight = 13;
    const tableDepth = 1.75;

    const tableBodyradius = 50; // Adjust the corner radius as needed
    const tableBodygeometry = new RoundedBoxGeometry(tableWidth, tableHeight, tableDepth, tableBodyradius);

    return <motion.mesh position={[0, 0.25, -1]} receiveShadow>
        <motion.bufferGeometry attach="geometry" {...tableBodygeometry} />
        <motion.meshBasicMaterial attach="material" color={"#FFDB58"} />
        <motion.meshPhongMaterial attach="material" color="#FFDB58" />
    </motion.mesh>
}