import { UserDocument } from "@/pages/api/schemas/user_schema";
import { playerCardAtom } from "@/recoil-state/player_cards/player_card/player_card.atom";
import { usePlayerCardsActions } from "@/recoil-state/player_cards/player_cards.actions";
import { playerCardsAtom } from "@/recoil-state/player_cards/player_cards.atom";
import { ButtonCustom, PText } from "@/shared";
import { ITab } from "@/utils";
import { trpc } from "@/utils/trpc";
import { OriginalCard } from "@/utils/types/original_card";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { AllCardsTab, AllDecksTab } from "./components";
import { playerDecksAtom } from "@/recoil-state/player_decks/player_decks.atom";
import { usePlayerDecksActions } from "@/recoil-state/player_decks/player_decks.actions";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";

function CardDecksTab() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const [activeTab, setActiveTab] = useState(0)

    const playerCardsState = useRecoilValue(playerCardsAtom);
    const playerCardsActions = usePlayerCardsActions();

    const playerDecksState = useRecoilValue(playerDecksAtom);
    const playerDecksActions = usePlayerDecksActions();

    const errorSuccessActions = useErrorSuccessActions();

    const getUserCards = trpc.getUserCards.useMutation();
    const getUserDecks = trpc.getUserDecks.useMutation();
    const updateUserDecks = trpc.updateUserDecks.useMutation();

    const tabs: ITab[] = [
        {
            title: "ALL DECKS",
            component: <AllDecksTab playerDecks={playerDecksState.playerDecks} />
        },
        {
            title: "ALL CARDS",
            component: <AllCardsTab playerDecks={playerDecksState.playerDecks} playerCards={playerCardsState.playerCards} />
        },
    ]

    useEffect(() => {
        if (!playerCardsState.fetched) {
            userCards()
        }
    }, [playerCardsState.fetched])

    useEffect(() => {
        if (!playerDecksState.fetched && playerCardsState.fetched) {
            userDecks()
        }
    }, [playerDecksState.fetched, playerCardsState.fetched])

    const userCards = async () => {
        const userCards = await getUserCards.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })
        playerCardsActions.setAllCards(userCards.result as any)
    }

    const userDecks = async () => {
        const userDecks: any = await getUserDecks.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })

        // FILTERING IS NEEDED IN CASE CARDS USER SOLD SO THEY ARE NO LONGER IN HIS POSESSION BUT THEIR ID'S ARE STILL RECORDED IN HIS DECK.
        const filteredDecks = userDecks.map((deck: any) => ({
            ...deck,
            cards: deck.cards.filter((card: any) => playerCardsState.playerCards.some((playerCard) => playerCard.token_id === card))
        }));

        if (!(JSON.stringify(filteredDecks) === JSON.stringify(userDecks))) {
            const res = await updateUserDecks.mutateAsync({
                decks: filteredDecks
            })
            if (res.includes(null)) {
                errorSuccessActions.openErrorSuccess('Could not update all documents', ErrorSuccessType.ERROR)
            }
        }
        //

        playerDecksActions.setAllDecks(filteredDecks)
    }


    return <div className="flex-col items-start w-full space-y-3">
        <div className="flex items-start justify-center w-full space-x-3">
            {tabs.map((tab, index) => <ButtonCustom className={`${activeTab === index ? 'bg-secondary-400' : 'bg-white'} flex w-full`} textClassName="text-black" key={index} title={tab.title} onClick={() => setActiveTab(index)} />)}
        </div>
        {getUserCards.isLoading ? <div className="flex items-center justify-center"><CircularProgress className="w-10 h-10 text-secondary-400" /></div> :
            tabs[activeTab].component
        }
    </div>
}

export default CardDecksTab;