import { atom } from 'recoil';

interface PlayerCardAtom {
    isPicked: number | null;
}

export const InitialPlayerCardState = {
    isPicked: null,
}
export const playerCardAtom = atom<PlayerCardAtom>({
    key: 'playerCardState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerCardState,
});