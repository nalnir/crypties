import { atom } from 'recoil';
import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { UserDocument } from '@/pages/api/schemas/user_schema';

interface BattleLobbyAtom {
    allPlayers: UserDocument[];
    socketId?: string;
}

export const InitialBattleLobbyState = {
    allPlayers: [],
    socketId: undefined
}
export const battleLobbyAtom = atom<BattleLobbyAtom>({
    key: 'battleLobbyState', // unique ID (with respect to other atoms/selectors)
    default: InitialBattleLobbyState,
});