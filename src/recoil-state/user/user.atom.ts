import { UserDocument } from '@/pages/api/schemas/user_schema';
import { atom } from 'recoil';

interface UserAtom {
    user: UserDocument | null
}

export const InitialUserState = {
    user: null
}
export const userAtom = atom<UserAtom>({
    key: 'userAtom', // unique ID (with respect to other atoms/selectors)
    default: InitialUserState,
});