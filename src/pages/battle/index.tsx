import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import { UserDocument } from "../api/schemas/user_schema";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import socket from "../../socket/socket";
import { AuthGuard } from "@/recoil-state/auth/auth.guard";
import { useRecoilValue } from "recoil";
import { battleAtom, useBattleActions } from "@/recoil-state/battle";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";


export default function BattlePage() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const router = useRouter()
    const connectToLobby = trpc.connectToLobby.useMutation();
    const battleState = useRecoilValue(battleAtom);
    const battleActions = useBattleActions();
    const errorSuccessActions = useErrorSuccessActions();

    useEffect(() => {
        if (user) {
            handleConnect(user)
        } else {
            router.push('/')
        }
    }, [user])

    socket.on("users", (users) => {
        console.log('USERS: ', users)
    });

    socket.on("user_connected", (users) => {
        battleActions.setSocketId(users.socketId)
    });

    socket.on("user_already_connected", (user) => {
        errorSuccessActions.openErrorSuccess('User already connected to a lobby!')
        router.push('/')
    });

    const handleConnect = async (user: UserDocument) => {
        const walletAddress = user.walletAddress
        socket.auth = { walletAddress };
        socket.connect();
    }

    return <AuthGuard>
        <div className="w-screen h-screen bg-primary-400" >

        </div>
    </AuthGuard>
}