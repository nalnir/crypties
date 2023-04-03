import { useRecoilValue, useSetRecoilState } from "recoil";
import { Vector3 } from '@react-three/fiber';
import { enemyCardAtom } from "./enemy_card.atom";
import { PlayingCardModel } from "@/utils/mocks/player_deck";

export function useEnemyCardActions() {
    const setEnemyCard = useSetRecoilState(enemyCardAtom);
    const enemyCardState = useRecoilValue(enemyCardAtom)

    return {
        setTargetCard,
    };

    async function setTargetCard(coordinates: { left: number, top: number }, card: PlayingCardModel | null, cardIdx: number | null) {
        const currentCoordinates = {
            left: coordinates.left,
            top: coordinates.top,
        }
        setEnemyCard((state) => ({
            ...state,
            cardCoordinates: currentCoordinates,
            enemyCard: card,
            enemyCardIdx: cardIdx
        }))
    }
}