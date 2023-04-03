import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { Box } from "@react-three/drei";
import { Vector3 } from "react-three-fiber";

interface CardBoxProps {
    cards: PlayingCardModel[];
    position: Vector3;
}
export const CardBox = ({ position }: CardBoxProps) => {
    return (
        <group
            position={position}
            receiveShadow
            castShadow>
            {/* Outer box */}
            <Box args={[1.5, 1, 0.1]}>
                <meshStandardMaterial
                    color={"#C9A0DC"}
                    roughness={0.5}
                    metalness={0.5}
                />
            </Box>
            <Box
                args={[0.1, 1.2, 2]}
                position={[-0.7, -0.05, 1]}>
                <meshStandardMaterial
                    color={"#C9A0DC"}
                    roughness={0.5}
                    metalness={0.5}
                />
            </Box>
            <Box args={[0.1, 1.2, 2]} position={[0.7, -0.05, 1]}>
                <meshStandardMaterial color={"#C9A0DC"} roughness={0.5} metalness={0.5} />
            </Box>
            <Box args={[1.5, 0.1, 2]} position={[0, 0.5, 1]}>
                <meshStandardMaterial color={"#C9A0DC"} roughness={0.5} metalness={0.5} />
            </Box>
            <Box args={[1.5, 0.1, 2]} position={[0, -0.62, 1]}>
                <meshStandardMaterial color={"#C9A0DC"} roughness={0.5} metalness={0.5} />
            </Box>
            {/* Cards */}
            <group position-y={0.40}>
                <Box args={[1.5, 0.1, 2.5]} position={[0, 0, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.04, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.08, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.12, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.16, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.20, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.24, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.28, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.32, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.36, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.40, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.44, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.48, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.52, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.56, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.60, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.64, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.68, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.72, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.76, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.8, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.84, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.88, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.92, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
                <Box args={[1.5, 0.1, 2.5]} position={[0, -0.96, 1.5]} scale={[0.85, 0.1, 0.5]}>
                    <meshStandardMaterial color={'#51CF66'} roughness={0.5} metalness={0.5} />
                </Box>
            </group>
        </group>
    );
}
