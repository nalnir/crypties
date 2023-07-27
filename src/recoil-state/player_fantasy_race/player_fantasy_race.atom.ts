import { RaceDocument } from '@/pages/api/schemas/race_schema';
import { atom } from 'recoil';

interface PlayerFantasyRaceAtom {
    _id: string;
    imageOptions: string[];
    imageChoice: string;
    nameCombinations: string[]
    fetched: boolean;
    race?: RaceDocument;
    name: string;
}

export const InitialPlayerFantasyRaceState = {
    _id: '',
    imageOptions: [],
    imageChoice: '',
    nameCombinations: [],
    fetched: false,
    race: undefined,
    name: '',
}
export const playerFantasyRaceAtom = atom<PlayerFantasyRaceAtom>({
    key: 'playerFantasyRaceState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerFantasyRaceState,
});