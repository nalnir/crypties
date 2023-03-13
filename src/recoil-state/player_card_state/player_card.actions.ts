import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerCardAtom } from "./player_card.atom";

export function usePlayerCardActions() {
    const setPlayerCard = useSetRecoilState(playerCardAtom);
    const playerCardState = useRecoilValue(playerCardAtom)

    return {
        pickCard
    };

    function pickCard(index: number | null) {
        setPlayerCard((state) => ({
            ...state,
            isPicked: index
        }));
    }
}