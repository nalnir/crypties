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
import { ButtonCustom, PText } from "@/shared/components";
import { AuthGuard } from "@/recoil-state/auth/auth.guard";
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { UserDocument } from '@/pages/api/schemas/user_schema';
import { BigNumber, utils } from 'ethers';
import { set } from 'mongoose';
import { useErrorSuccessActions } from '@/recoil-state/error_success/error_success.actions';
import { ErrorSuccessType } from '@/recoil-state/error_success/error_success.atom';
import { Link } from '@imtbl/imx-sdk';
import { useGlobalModalActions } from '@/recoil-state/global_modal/global_modal.actions';
import { allowOnlyNumbersDecimals } from '@/shared';

export type Room = {
    roomId: string;
    players: number;
};

const socket = io('http://localhost:3001');
const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';
const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

function MainPage() {
    const router = useRouter()
    const authActions = useAuthActions();
    const errorSuccessActions = useErrorSuccessActions();
    const [rooms, setRooms] = useState<Room[] | undefined>();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const globalModalActions = useGlobalModalActions();

    const userBalance = trpc.getUserBalance.useQuery({ walletAddress: user?.walletAddress ?? '' });

    const disconnectIMX = async () => {
        await authActions.logout()
        router.push('/')
    }

    const fundAccount = async (amount: string) => {
        try {
            const res = await link.deposit({
                amount: amount,
            })
            console.log('res: ', res)
        } catch (e) {
            console.log('e: ', e)
            errorSuccessActions.openErrorSuccess('Something went wrong. Please try again', ErrorSuccessType.ERROR)
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

    return <AuthGuard>
        <div className="flex">
            <div className={`${isDrawerOpen ? '' : 'hidden'} w-10/12 h-full bg-white`}><DrawerCustom /></div>
            <div>
                <div className="flex items-center justify-between p-5 bg-primary-500">
                    {isDrawerOpen ?
                        <div onClick={() => setIsDrawerOpen(false)} className="cursor-pointer"><ClearIcon /></div> :
                        <div onClick={() => setIsDrawerOpen(true)} className="cursor-pointer"><MenuIcon /></div>}
                    <div className='flex items-center justify-end space-x-3'>
                        <PText>{userBalance.data} ETH</PText>
                        <ButtonCustom title="Deposit funds to L2" onClick={() => globalModalActions.openGlobalModal(<DepositFundsModal fundAccount={(amount) => fundAccount(amount)} />)} />
                        <ButtonCustom title="Disconnect" onClick={() => disconnectIMX()} />
                    </div>
                </div>
                <div>
                    <Register />
                </div>
            </div>
        </div>
    </AuthGuard>
}

export default MainPage

interface DepositFundsModalProps {
    fundAccount: (amount: string) => void
}
const DepositFundsModal = ({ fundAccount }: DepositFundsModalProps) => {
    const [amount, setAmount] = useState('0');

    return <div className='flex items-center justify-center space-x-3'>
        <input value={amount} onChange={(e) => {
            const formated = allowOnlyNumbersDecimals(e.target.value)
            if (formated) {
                setAmount(formated)
            }
        }} />
        <ButtonCustom disabled={parseFloat(amount) <= 0} title='Fund' onClick={() => fundAccount(amount)} />
    </div>
}