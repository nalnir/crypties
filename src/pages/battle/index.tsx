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
        return () => {
            socket.disconnect();
        }
    }, [user])

    socket.on("users", (users) => {
        if (users.length > 1) {
            console.log('USERS: ', users)
            const player1 = users.shift();
            const player2 = users.shift();
            const players = {
                player1: player1,
                player2: player2
            }
            socket.emit('join_battle_room', players);
        }
    });

    socket.on("battle_start", (data) => {
        console.log('Data: ', data)
    })

    socket.on("user_connected", (user) => {
        battleActions.setSocketId(user.socketId)
    });

    socket.on("user_already_connected", (user) => {
        errorSuccessActions.openErrorSuccess('User already connected to a lobby!')
        router.push('/')
    });

    const handleConnect = async (user: UserDocument) => {
        console.log('handleConnect: ', user)
        const walletAddress = user.walletAddress
        socket.auth = { walletAddress };
        console.log('walletAddress: ', walletAddress)
        socket.connect();
    }

    return <AuthGuard>
        <div className="w-screen h-screen bg-primary-400" >

        </div>
    </AuthGuard>
}