import { atom } from 'recoil';

export interface IProgressiveLoaderStep {
    position: number;
    description: string;
}

interface ProgressiveLoaderAtom {
    open: boolean;
    activeStep: IProgressiveLoaderStep;
    steps: number
}

export const InitialProgressiveLoaderState = {
    open: false,
    activeStep: {
        position: 0,
        description: ''
    },
    steps: 0
}
export const progressiveLoaderAtom = atom<ProgressiveLoaderAtom>({
    key: 'progressiveLoaderState', // unique ID (with respect to other atoms/selectors)
    default: InitialProgressiveLoaderState,
});