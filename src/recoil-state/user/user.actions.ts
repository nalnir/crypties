import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "./user.atom";

export function useUserActions() {
    const setUser = useSetRecoilState(userAtom);
    const userState = useRecoilValue(userAtom)

    return {
        login,
        register
    };

    async function login(walletAddress: string) {
        const response = await fetch(`/api/user/login?walletAddress=${walletAddress}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        const data = result.data
        setUser((state) => ({
            ...state,
            user: data
        }))
        return data;
    }

    async function register(walletAddress: string) {
        const response = await fetch(`/api/user/register?walletAddress=${walletAddress}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
        });

        const result = await response.json();
        const data = result.data
        setUser((state) => ({
            ...state,
            user: data
        }))
        return data;
    }
}