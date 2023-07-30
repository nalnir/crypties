import { atom } from 'recoil';
import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { UserDocument } from '@/pages/api/schemas/user_schema';

interface BattleAtom {
    allPlayers: UserDocument[];
    socketId?: string;
}

export const InitialBattleState = {
    allPlayers: [],
    socketId: undefined
}
export const battleAtom = atom<BattleAtom>({
    key: 'battleState', // unique ID (with respect to other atoms/selectors)
    default: InitialBattleState,
});