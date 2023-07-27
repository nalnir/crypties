import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';
import { OriginalCard } from '@/utils/types/original_card';

interface PlayerCardsAtom {
    playerCards: Array<OriginalCard>;
    playerCardsOnTheBoard: Array<OriginalCard>;
    fetched: boolean;
}

export const InitialPlayerCardsState = {
    playerCards: [],
    playerCardsOnTheBoard: [],
    fetched: false
}
export const playerCardsAtom = atom<PlayerCardsAtom>({
    key: 'playerCardsState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerCardsState,
});