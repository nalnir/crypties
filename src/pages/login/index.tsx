import { useAuthActions } from "@/recoil-state/auth/auth.actions";
import { authAtom } from "@/recoil-state/auth/auth.atom";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ButtonCustom } from "@/shared";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { UserDocument } from "../api/schemas/user_schema";
import { api } from "@/utils/api";

export default function LoginPage() {
    const useAuth = useAuthActions();
    const authState = useRecoilValue(authAtom);
    const router = useRouter();
    const errorSuccessActions = useErrorSuccessActions();
    const getUser = api.user.getUser.useMutation();
    const queryClient = useQueryClient();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const userWalletAddress = await useAuth.loadFromStorage();
        if (userWalletAddress) {
            const currentUser = await getUser.mutateAsync({
                walletAddress: userWalletAddress
            })
            if (currentUser) {
                router.push('/');
            } else {
                errorSuccessActions.openErrorSuccess('User does not exist', ErrorSuccessType.ERROR)
            }
        }
    }

    const connect = async () => {
        const address = await useAuth.setupAccount()
        if (address) {
            const user = await useAuth.login(address)
            queryClient.setQueryData(['user'], user);
            router.push('/');
        } else {
            errorSuccessActions.openErrorSuccess('Could not get the wallet address!')
        }
    }

    if (!authState.isLocalStorageLoaded || authState.isLoggedIn) {
        return <div></div>
    }

    return <div className="w-screen h-screen bg-primary-400">
        <ButtonCustom title="Connect" onClick={connect} />
    </div>
}