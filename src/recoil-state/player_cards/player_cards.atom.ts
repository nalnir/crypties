import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';

interface PlayerCardsAtom {
    playerCards: Array<PlayingCardModel>;
    playerCardsOnTheBoard: Array<PlayingCardModel>
}

export const InitialPlayerCardsState = {
    playerCards: [],
    playerCardsOnTheBoard: []
}
export const playerCardsAtom = atom<PlayerCardsAtom>({
    key: 'playerCardsState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerCardsState,
});