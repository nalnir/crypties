import { atom } from 'recoil';
import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';

interface DefaultClassesAtom {
    classes: PlayerClassDocument[];
    fetched: boolean;
    doneSet: boolean;
}

export const DefaultClassesState = {
    classes: [],
    fetched: false,
    doneSet: false
}
export const defaultClassesAtom = atom<DefaultClassesAtom>({
    key: 'defaultClassesState', // unique ID (with respect to other atoms/selectors)
    default: DefaultClassesState,
});