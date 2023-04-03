import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';

interface GameAtom {
    gameOver: boolean;
    initialized: boolean;
}

export const InitialGameState = {
    gameOver: false,
    initialized: true
}
export const gameAtom = atom<GameAtom>({
    key: 'gameState', // unique ID (with respect to other atoms/selectors)
    default: InitialGameState,
});