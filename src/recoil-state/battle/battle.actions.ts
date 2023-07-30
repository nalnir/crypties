import { useSetRecoilState } from "recoil";
import { battleAtom } from "./battle.atom";
import { PlayerClassDocument } from "@/pages/api/schemas/class_schema";
import { UserDocument } from "@/pages/api/schemas/user_schema";

export function useBattleActions() {
    const setBattle = useSetRecoilState(battleAtom);

    return {
        setPlayer,
        setSocketId
    };

    function setPlayer(player: UserDocument) {
        setBattle((state: any) => ({
            ...state,
            allPlayers: [...state.allPlayers, player]
        }))

    }

    function setSocketId(socketId: string) {
        setBattle((state: any) => ({
            ...state,
            socketId: socketId
        }))
    }
}