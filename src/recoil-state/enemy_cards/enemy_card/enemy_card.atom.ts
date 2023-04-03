import { PlayingCardModel } from '@/utils/mocks/player_deck';
import { atom } from 'recoil';

interface EnemyCardAtom {
    isPicked: number | null;
    enemyCard: PlayingCardModel | null
    cardCoordinates: {
        left: number,
        top: number,
    },
    enemyCardIdx: number | null
}

export const InitialEnemyCardState = {
    isPicked: null,
    enemyCard: null,
    cardCoordinates: {
        left: 0,
        top: 0
    },
    enemyCardIdx: null
}
export const enemyCardAtom = atom<EnemyCardAtom>({
    key: 'enemyCardState', // unique ID (with respect to other atoms/selectors)
    default: InitialEnemyCardState,
});