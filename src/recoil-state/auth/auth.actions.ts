import { ImmutableXClient, Link } from "@imtbl/imx-sdk";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { authAtom } from "./auth.atom";
import { LOCAL_CRYPTIES_STORAGE_KEY, LocalStorage } from "@/utils";

import { InitialUserState, userAtom } from "../user/user.atom";
import { InitialPlayerDecksState, playerDecksAtom } from "../player_decks/player_decks.atom";
import { InitialOnboardingHeroState, onboardingHeroAtom } from "../onboarding_hero/onboarding_hero.atom";
import { InitialPlayerCardsState, playerCardsAtom } from "../player_cards/player_cards.atom";
import { api } from "@/utils/api";
import { users } from "@prisma/client";

export function useAuthActions() {
    const setAuth = useSetRecoilState(authAtom);
    const setUser = useSetRecoilState(userAtom);
    const setDecks = useSetRecoilState(playerDecksAtom);
    const setCards = useSetRecoilState(playerCardsAtom);
    const setOnboarding = useSetRecoilState(onboardingHeroAtom);
    const authState = useRecoilValue(authAtom);

    const getUser = api.user.getUser.useMutation();
    const getPublicUser = api.user.getPublicUser.useMutation();
    const registerUser = api.user.register.useMutation();
    const getAuthToken = api.auth.getAuthToken.useMutation();
    const registerAuthToken = api.auth.registerAuthToken.useMutation();
    const invalidateAuthToken = api.auth.invalidateAuthToken.useMutation();

    return {
        connectIMX,
        setupAccount,
        loadFromStorage,
        logout,
        login
    };

    async function connectIMX() {
        // MAINNET
        // const linkAddress = 'https://link.x.immutable.com';
        // const apiAddress = 'https://api.x.immutable.com/v1';

        // const linkAddress = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS;
        // const apiAddress = process.env.NEXT_PUBLIC_IMX_API_ADDRESS;

        const linkAddress = 'https://link.sandbox.x.immutable.com';
        const apiAddress = 'https://api.sandbox.x.immutable.com/v1';
        if (!authState.imxLink) {
            if (linkAddress && apiAddress) {
                const link = new Link(linkAddress, null, 'v3');
                const client = await ImmutableXClient.build({ publicApiUrl: apiAddress });
                setAuth((state: any) => ({
                    ...state,
                    imxLink: link
                }))
                return link;
            } else {
                throw Error('Could not connect to IMX. Provide neccessary keys')
            }
        }
        return authState.imxLink
    }

    async function setupAccount() {
        let imxLink = authState.imxLink;
        if (!imxLink) {
            imxLink = await connectIMX()
        }
        try {
            const { address, starkPublicKey } = await imxLink.setup({});
            localStorage.setItem('WALLET_ADDRESS', address);
            localStorage.setItem('STARK_PUBLIC_KEY', starkPublicKey);
            return address
        } catch (e) {
            console.log('error: ', e)
            return;
        }
    }

    async function login(address: string) {
        let currentUser = await getPublicUser.mutateAsync({
            walletAddress: address
        })
        if (!currentUser) {
            currentUser = await registerUser.mutateAsync({
                walletAddress: address
            })
        }

        const currentDate = new Date();
        let authToken: any = await getAuthToken.mutateAsync({
            walletAddress: address
        })
        if (!authToken) {
            authToken = await registerAuthToken.mutateAsync({
                walletAddress: address,
                userId: currentUser.id
            })
        }

        if (currentDate > new Date(authToken.validUntil)) {
            await invalidateAuthToken.mutateAsync({
                walletAddress: address
            })
            authToken = await registerAuthToken.mutateAsync({
                walletAddress: address,
                userId: currentUser.id
            })
        }
        LocalStorage.set(LOCAL_CRYPTIES_STORAGE_KEY.AUTH, authToken);
        setAuth((state) => ({
            ...state,
            isLocalStorageLoaded: true,
            isLoggedIn: true,
            auth: authToken,
        }))

        return currentUser;
    }

    async function logout() {
        LocalStorage.remove(LOCAL_CRYPTIES_STORAGE_KEY.AUTH);
        resetStates()
        setAuth((state) => ({
            ...state,
            isLocalStorageLoaded: true,
            isLoggedIn: false,
            auth: null,
        }))
    }

    async function loadFromStorage(): Promise<string | undefined> {
        if (authState.isLocalStorageLoaded) {
            return authState.auth?.userWalletAddress;
        }
        const storedAuth = LocalStorage.get(LOCAL_CRYPTIES_STORAGE_KEY.AUTH);
        if (storedAuth) {
            if (new Date(storedAuth.validUntil) < new Date()) {
                setAuth((state) => ({
                    ...state,
                    isLocalStorageLoaded: true,
                    isLoggedIn: false,
                    auth: null,
                }));
                LocalStorage.remove(LOCAL_CRYPTIES_STORAGE_KEY.AUTH);
                return undefined;
            } else {
                setAuth((state) => ({
                    ...state,
                    isLocalStorageLoaded: true,
                    isLoggedIn: true,
                    auth: storedAuth,
                }));
            }

            return storedAuth?.userWalletAddress;
        } else {
            setAuth((state) => ({
                ...state,
                isLocalStorageLoaded: true,
                isLoggedIn: false,
                auth: null,
            }));
            return undefined;
        }
    }

    function resetStates() {
        setUser(InitialUserState);
        setCards(InitialPlayerCardsState);
        setOnboarding(InitialOnboardingHeroState)
        setDecks(InitialPlayerDecksState);
    }
}