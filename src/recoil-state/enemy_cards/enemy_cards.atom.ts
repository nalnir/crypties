import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';

interface EnemyCardsAtom {
    enemyCards: Array<PlayingCardModel>;
    enemyCardsOnTheBoard: Array<PlayingCardModel>;
}

export const InitialEnemyCardsState = {
    enemyCards: [],
    enemyCardsOnTheBoard: [],
}
export const enemyCardsAtom = atom<EnemyCardsAtom>({
    key: 'enemyCardsState', // unique ID (with respect to other atoms/selectors)
    default: InitialEnemyCardsState,
});