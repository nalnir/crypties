import { useState } from 'react'
import io from 'socket.io-client'

import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';
import { DrawerCustom } from "@/shared/components/drawer_custom";
import { useUserActions } from "@/recoil-state/user/user.actions";
import Board2D from "./2D/board2D";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil-state/user/user.atom";
import Register from "@/views/register/register";
import { useAuthActions } from "@/recoil-state/auth/auth.actions";
import { authAtom } from "@/recoil-state/auth/auth.atom";
import { ButtonCustom } from "@/shared/components";
import { AuthGuard } from "@/recoil-state/auth/auth.guard";
import { useRouter } from 'next/router';

export type Room = {
    roomId: string;
    players: number;
};

const socket = io('http://localhost:3001');
function MainPage() {
    const router = useRouter()
    const authActions = useAuthActions();
    const [rooms, setRooms] = useState<Room[] | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const disconnectIMX = async () => {
        await authActions.logout()
        router.push('/')
    }

    // useEffect(() => {
    //     socket.on('connect', () => {
    //         console.log('Connected to server:', socket.id);
    //     });

    //     socket.on('room_joined', (roomId, numPlayers) => {
    //         console.log(`Joined room ${roomId} with ${numPlayers} player(s)`);
    //     });

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);

    // useEffect(() => {
    //     if (!rooms) {
    //         socket.on('rooms_list', (availableRooms: Room[]) => {
    //             setRooms(availableRooms);
    //         });
    //     }
    // }, [rooms])

    return <AuthGuard>
        <div className="flex">
            <div className={`${isDrawerOpen ? '' : 'hidden'} w-10/12 h-full bg-white`}><DrawerCustom /></div>
            <div>
                <div className="flex items-center justify-between p-5 bg-primary-500">
                    {isDrawerOpen ?
                        <div onClick={() => setIsDrawerOpen(false)} className="cursor-pointer"><ClearIcon /></div> :
                        <div onClick={() => setIsDrawerOpen(true)} className="cursor-pointer"><MenuIcon /></div>}
                    <ButtonCustom title="Disconnect" onClick={() => disconnectIMX()} />
                </div>
                <div>
                    <Register />
                </div>
            </div>
        </div>
    </AuthGuard>
}

export default MainPage