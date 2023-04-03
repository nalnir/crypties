import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerCardAtom } from "./player_card.atom";

export function usePlayerCardActions() {
    const setPlayerCard = useSetRecoilState(playerCardAtom);
    const playerCardState = useRecoilValue(playerCardAtom)

    return {
        pickCard,
        attackCard,
        setPlayerCardForAttacking
    };

    function pickCard(index: number | null) {
        setPlayerCard((state: any) => ({
            ...state,
            isPicked: index
        }));
    }

    function attackCard(enemyPosition: null) {
        setPlayerCard((state: any) => ({
            ...state,
            attackingCard: enemyPosition
        }))
    }

    async function setPlayerCardForAttacking(coordinates: { left: number, top: number }, card?: PlayingCardModel) {
        const currentCoordinates = {
            left: coordinates.left,
            top: coordinates.top,
        }
        setPlayerCard((state) => ({
            ...state,
            cardCoordinates: currentCoordinates,
            card
        }))
    }
}