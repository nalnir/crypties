import { atom } from 'recoil';

interface PlayerClassAtom {
    imageOptions: string[];
    imageChoice: string;
    description: string;
    name: string;
    nameCombinations: string[]
    fetched: boolean;
}

export const InitialPlayerClassState = {
    imageOptions: [],
    imageChoice: '',
    description: '',
    name: '',
    nameCombinations: [],
    fetched: false
}
export const playerClassAtom = atom<PlayerClassAtom>({
    key: 'playerClassState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerClassState,
});