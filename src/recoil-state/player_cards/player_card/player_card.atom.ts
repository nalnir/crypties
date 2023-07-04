import { atom } from 'recoil';
import { PlayingCardModel } from '@/utils/mocks/player_deck';
import { CardPosition } from '@/views/3D/main_canvas';

interface PlayerCardAtom {
    isPicked: number | null;
    attackingCard: CardPosition | null;
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