import { atom } from 'recoil';

export enum ErrorSuccessType {
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    SUCCESS = "success"
}

interface ErrorSuccessAtom {
    open: boolean;
    message: string;
    type: ErrorSuccessType
    timeout: number;
}

export const InitialErrorSuccessState = {
    open: false,
    message: '',
    type: ErrorSuccessType.INFO,
    timeout: 1500
}
export const errorSuccessAtom = atom<ErrorSuccessAtom>({
    key: 'errorSuccessState', // unique ID (with respect to other atoms/selectors)
    default: InitialErrorSuccessState,
});