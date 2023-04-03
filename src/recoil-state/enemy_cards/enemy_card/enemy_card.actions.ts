import { useSetRecoilState } from "recoil";
import { enemyCardAtom } from "./enemy_card.atom";
import { PlayingCardModel } from "@/utils/mocks/player_deck";

export function useEnemyCardActions() {
    const setEnemyCard = useSetRecoilState(enemyCardAtom);

    return {
        setTargetCard,
    };

    async function setTargetCard(coordinates: { left: number, top: number }, card: PlayingCardModel | null, cardIdx: number | null) {
        const currentCoordinates = {
            left: coordinates.left,
            top: coordinates.top,
        }
        setEnemyCard((state: any) => ({
            ...state,
            cardCoordinates: currentCoordinates,
            enemyCard: card,
            enemyCardIdx: cardIdx
        }))
    }
}