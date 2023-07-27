import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { atom } from 'recoil';

interface PlayerClassAtom {
    _id: string;
    imageOptions: string[];
    imageChoice: string;
    name: string;
    nameCombinations: string[];
    playerClass?: PlayerClassDocument;
    fetched: boolean;
}

export const InitialPlayerClassState = {
    _id: '',
    imageOptions: [],
    imageChoice: '',
    name: '',
    nameCombinations: [],
    playerClass: undefined,
    fetched: false
}
export const playerClassAtom = atom<PlayerClassAtom>({
    key: 'playerClassState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerClassState,
});