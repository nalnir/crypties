import { useRecoilValue, useSetRecoilState } from "recoil";
import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { gameAtom } from "./game.atom";

export function useGameActions() {
    const setGame = useSetRecoilState(gameAtom);
    const gameState = useRecoilValue(gameAtom)

    return {
        handleGameOver,
        restartGame,
        doneInitialized
    };

    function handleGameOver() {
        setGame((state) => ({
            ...state,
            gameOver: true
        }))
    }

    function restartGame() {
        setGame((state) => ({
            ...state,
            gameOver: false
        }))
    }

    function doneInitialized() {
        setGame((state) => ({
            ...state,
            initialized: true
        }))
    }
}