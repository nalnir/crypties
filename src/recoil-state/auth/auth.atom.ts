import { AuthTokenDocument } from '@/pages/api/schemas/auth_token_schema';
import { Link } from '@imtbl/imx-sdk';
import { atom } from 'recoil';


interface AuthAtom {
    imxLink?: Link;
    isLoggedIn: boolean;
    isLocalStorageLoaded: boolean;
    auth?: AuthTokenDocument | null;
}

export const InitialAuthState: AuthAtom = {
    imxLink: undefined,
    isLoggedIn: false,
    isLocalStorageLoaded: false,
    auth: null
}
export const authAtom = atom<AuthAtom>({
    key: 'authState', // unique ID (with respect to other atoms/selectors)
    default: InitialAuthState,
});