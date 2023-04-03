import { useRecoilValue, useSetRecoilState } from "recoil";
import { Vector3 } from '@react-three/fiber';
import { enemyCardsAtom } from "./enemy_cards.atom";
import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { gameAtom } from "../game/game.atom";

export function useEnemyCardsActions() {
    const setEnemyCards = useSetRecoilState(enemyCardsAtom);
    const enemyCardsState = useRecoilValue(enemyCardsAtom)

    return {
        placeCardsOnTheBoard,
        placeCardsInTheDeck,
        initializeFullDeck
    };

    function placeCardsOnTheBoard(cards: PlayingCardModel[]) {
        setEnemyCards((state) => ({
            ...state,
            enemyCardsOnTheBoard: [...cards]
        }))
    }

    function initializeFullDeck(cards: PlayingCardModel[]) {
        setEnemyCards((state) => ({
            ...state,
            enemyCards: [...cards]
        }))
    }

    function placeCardsInTheDeck(cards: PlayingCardModel[]) {
        setEnemyCards((state) => ({
            ...state,
            enemyCards: [...cards]
        }))
    }
}