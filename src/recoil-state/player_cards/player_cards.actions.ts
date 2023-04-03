import { useRecoilValue, useSetRecoilState } from "recoil";
import { Vector3 } from '@react-three/fiber';
import { playerCardsAtom } from "./player_cards.atom";
import { PlayingCardModel } from "@/utils/mocks/player_deck";

export function usePlayerCardsActions() {
    const setPlayerCards = useSetRecoilState(playerCardsAtom);
    const playerCardsState = useRecoilValue(playerCardsAtom)

    return {
        placeCardsOnTheBoard,
        initializeFullDeck
    };

    function placeCardsOnTheBoard(cards: PlayingCardModel[]) {
        setPlayerCards((state: any) => ({
            ...state,
            playerCardsOnTheBoard: [...cards]
        }))
    }

    function initializeFullDeck(cards: PlayingCardModel[]) {
        setPlayerCards((state: any) => ({
            ...state,
            playerCards: [...cards]
        }))
    }
}