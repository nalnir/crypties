import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';

interface PlayerCardAtom {
    isPicked: number | null;
    attackingCard: Vector3 | null;
    cardCoordinates: {
        left: number,
        top: number,
    }
    choosenCard: PlayingCardModel | null
}

export const InitialPlayerCardState = {
    isPicked: null,
    attackingCard: null,
    cardCoordinates: {
        left: 0,
        top: 0,
    },
    choosenCard: null
}
export const playerCardAtom = atom<PlayerCardAtom>({
    key: 'playerCardState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerCardState,
});