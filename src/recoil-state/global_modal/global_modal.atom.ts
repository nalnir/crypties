import { atom } from 'recoil';

interface GlobalModalAtom {
    open: boolean;
    component: any;
}

export const InitialGlobalModalState = {
    open: false,
    component: null
}
export const globalModalAtom = atom<GlobalModalAtom>({
    key: 'globalModalState', // unique ID (with respect to other atoms/selectors)
    default: InitialGlobalModalState,
});