import { useRecoilValue, useSetRecoilState } from "recoil";
import { Vector3 } from '@react-three/fiber';
import { playerCardsAtom } from "./player_cards.atom";
import { OriginalCard } from "@/utils/types/original_card";

export function usePlayerCardsActions() {
    const setPlayerCards = useSetRecoilState(playerCardsAtom);
    const playerCardsState = useRecoilValue(playerCardsAtom)

    return {
        placeCardsOnTheBoard,
        initializeFullDeck
    };

    function placeCardsOnTheBoard(cards: OriginalCard[]) {
        setPlayerCards((state: any) => ({
            ...state,
            playerCardsOnTheBoard: [...cards]
        }))
    }

    function initializeFullDeck(cards: OriginalCard[]) {
        setPlayerCards((state: any) => ({
            ...state,
            playerCards: [...cards]
        }))
    }
}