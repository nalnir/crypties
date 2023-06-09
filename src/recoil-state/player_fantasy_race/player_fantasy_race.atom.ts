import { atom } from 'recoil';

interface PlayerFantasyRaceAtom {
    _id: string;
    imageOptions: string[];
    imageChoice: string;
    description: string;
    name: string;
    nameCombinations: string[]
    fetched: boolean;
}

export const InitialPlayerFantasyRaceState = {
    _id: '',
    imageOptions: [],
    imageChoice: '',
    description: '',
    name: '',
    nameCombinations: [],
    fetched: false
}
export const playerFantasyRaceAtom = atom<PlayerFantasyRaceAtom>({
    key: 'playerFantasyRaceState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerFantasyRaceState,
});