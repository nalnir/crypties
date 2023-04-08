import { Loader } from "@/shared/components/loader"
import { Button, Input } from "@mui/material"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Suspense, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { MainCanvas } from "./3D/components/main_canvas"
import dynamic from 'next/dynamic'
import { DrawerCustom } from "@/shared/components/drawer_custom"
import { InjectedConnector } from 'wagmi/connectors/injected'

import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';
import { useAccount, useConnect } from "wagmi"
import { Board2D } from "./2D/board2D"

export type Room = {
    roomId: string;
    players: number;
};

const socket = io('http://localhost:3001');
export const MainPage = () => {
    const [rooms, setRooms] = useState<Room[] | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    console.log('isConnected: ', isConnected)

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('room_joined', (roomId, numPlayers) => {
            console.log(`Joined room ${roomId} with ${numPlayers} player(s)`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!rooms) {
            socket.on('rooms_list', (availableRooms: Room[]) => {
                setRooms(availableRooms);
            });
        }
    }, [rooms])

    return <div className="flex">
        <div className={`${isDrawerOpen ? '' : 'hidden'} w-10/12 h-full bg-white`}><DrawerCustom /></div>
        <div>
            <div className="flex items-center justify-between p-5 bg-primary-500">
                {isDrawerOpen ?
                    <div onClick={() => setIsDrawerOpen(false)} className="cursor-pointer"><ClearIcon /></div> :
                    <div onClick={() => setIsDrawerOpen(true)} className="cursor-pointer"><MenuIcon /></div>}
                <ConnectButton />
            </div>

            <div className="h-screen">
                <Board2D />
                {/* <Suspense fallback={<Loader />}>
                    <MainCanvas />
                </Suspense> */}
            </div>

            {/* <Input
                placeholder="Room Name"
                value={room}
                onChange={(e)=>setRoom(e.target.value)}
            /> */}
            {/* <Button 
                onClick={enterRoom}
            >Create room</Button> */}
        </div>
    </div>
}