import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import { InjectedConnector } from 'wagmi/connectors/injected'

import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';
import { useAccount, useConnect } from "wagmi"
import { DrawerCustom } from "@/shared/components/drawer_custom";
import { useUserActions } from "@/recoil-state/user/user.actions";
import withAuth from "@/shared/functions/with_auth";
import Board2D from "./2D/board2D";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/recoil-state/user/user.atom";
import Register from "@/views/register/register";
import { ImmutableXClient, Link } from "@imtbl/imx-sdk";

export type Room = {
    roomId: string;
    players: number;
};

const socket = io('http://localhost:3001');
function MainPage() {
    const userActions = useUserActions();
    const userState = useRecoilValue(userAtom);
    const [rooms, setRooms] = useState<Room[] | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    // Mainnet
    // const linkAddress = 'https://link.x.immutable.com';
    // const apiAddress = 'https://api.x.immutable.com/v1';

    // Goerli Testnet
    const linkAddress = 'https://link.sandbox.x.immutable.com';
    const apiAddress = 'https://api.sandbox.x.immutable.com/v1';

    useEffect(() => {
    connectImmutableX()
    },[])

    const connectImmutableX = async () => {
        const link = new Link(linkAddress, null, 'v3');
        const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
    }


    useEffect(() => {
        if(isConnected) {
            handleLogin()
        }
    }, [isConnected])

    const handleLogin = async () => {
        console.log('handleLogin()')
        if(address) {
            const user = await userActions.login(address)
        } else {
            console.log('Could not get the address. Try again please!')
        }
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

    return <div className="flex">
        <div className={`${isDrawerOpen ? '' : 'hidden'} w-10/12 h-full bg-white`}><DrawerCustom /></div>
        <div>
            <div className="flex items-center justify-between p-5 bg-primary-500">
                {isDrawerOpen ?
                    <div onClick={() => setIsDrawerOpen(false)} className="cursor-pointer"><ClearIcon /></div> :
                    <div onClick={() => setIsDrawerOpen(true)} className="cursor-pointer"><MenuIcon /></div>}
                <ConnectButton />
            </div>

            <div>
                <Register />
            </div>
        </div>
    </div>
}

export default MainPage