import { PText } from "./p_text";
import { ButtonCustom } from "./button_custom";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { useQuery } from "@tanstack/react-query";
import { UserDocument } from '@/pages/api/schemas/user_schema';
import ClearIcon from '@mui/icons-material/Clear';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { UserRoles } from "@/pages/api/enums";
import { useRouter } from "next/router";
import { useAuthActions } from "@/recoil-state/auth/auth.actions";
import { trpc } from "@/utils/trpc";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { Link } from '@imtbl/imx-sdk';
import { allowOnlyNumbersDecimals } from "../functions";

const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';
const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

interface HeaderMainProps {
    onAdminSite?: boolean
}
export const HeaderMain = ({ onAdminSite }: HeaderMainProps) => {
    const router = useRouter()
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const authActions = useAuthActions();
    const globalModalActions = useGlobalModalActions();
    const errorSuccessActions = useErrorSuccessActions();
    // const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const test = trpc.testAuth.useMutation();


    const t = async () => {
        await test.mutateAsync();
    }


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

    return <div className="flex items-center justify-between p-5 bg-primary-500">
        <div className='flex items-center justify-start space-x-3'>
            {/* {isDrawerOpen ?
                <div onClick={() => setIsDrawerOpen(false)} className="cursor-pointer"><ClearIcon /></div> :
                <div onClick={() => setIsDrawerOpen(true)} className="cursor-pointer"><MenuIcon /></div>} */}
            {user?.roles?.includes(UserRoles.SUPERADMIN as string) ? <ButtonCustom title={onAdminSite ? "Back to main menu" : "Admin"} onClick={() => {
                if (onAdminSite) {
                    router.push('/')
                } else {
                    router.push('/admin')
                }
            }} /> : <></>}
        </div>
        <div className='flex items-center justify-end space-x-3'>
            <PText>{userBalance.data} ETH</PText>
            <ButtonCustom title="Deposit funds to L2" onClick={() => globalModalActions.openGlobalModal(<DepositFundsModal fundAccount={(amount: string) => fundAccount(amount)} />)} />
            <ButtonCustom title="Disconnect" onClick={() => disconnectIMX()} />
            <div onClick={t}>CLICK</div>
        </div>
    </div>
}

interface DepositFundsModalProps {
    fundAccount: (amount: string) => void
}
const DepositFundsModal = ({ fundAccount }: DepositFundsModalProps) => {
    const [amount, setAmount] = useState('0');

    return <div className='flex items-center justify-center space-x-3'>
        <input value={amount} onChange={(e) => {
            const formated = allowOnlyNumbersDecimals(e.target.value, true)
            if (formated) {
                setAmount(formated)
            }
        }} />
        <ButtonCustom disabled={parseFloat(amount) <= 0} title='Fund' onClick={() => fundAccount(amount)} />
    </div>
}