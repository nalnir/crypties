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
import { AllCardsTab, DefaultDecksTab, PlayerDecksTab } from "./components";
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

    const getUserCards = trpc.getUserCards.useQuery({ walletAddress: user?.walletAddress ?? '' });
    const getUserDecks = trpc.getUserDecks.useQuery({ walletAddress: user?.walletAddress ?? '' });
    const updateUserDecks = trpc.updateUserDecks.useMutation();

    const allUserDecks = getUserDecks.data ?? [];
    const allPlayerCards = getUserCards.data ? getUserCards.data.result : [];

    const tabs: ITab[] = [
        {
            title: "BUY DEFAULT DECKS",
            component: <DefaultDecksTab />
        },
        {
            title: "PLAYER DECKS",
            component: <PlayerDecksTab />
        },
        {
            title: "ALL CARDS",
            component: <AllCardsTab />
        },
    ]

    useEffect(() => {
        if (getUserDecks.isFetched && getUserCards.isFetched) {
            userDecks()
        }
    }, [getUserDecks.isFetched, getUserCards.isFetched])

    const userDecks = async () => {
        // FILTERING IS NEEDED IN CASE CARDS USER SOLD SO THEY ARE NO LONGER IN HIS POSESSION BUT THEIR ID'S ARE STILL RECORDED IN HIS DECK.
        const filteredDecks = allUserDecks.map((deck: any) => ({
            ...deck,
            cards: deck.cards.filter((card: string) => allPlayerCards.some((playerCard) => playerCard.token_id === card))
        }));
        console.log('filteredDecks: ', filteredDecks)

        if (!(JSON.stringify(filteredDecks) === JSON.stringify(allUserDecks))) {
            const res = await updateUserDecks.mutateAsync({
                decks: filteredDecks
            })
            if (res.includes(null)) {
                errorSuccessActions.openErrorSuccess('Could not update all documents', ErrorSuccessType.ERROR)
            }
        }
        //

        getUserDecks.refetch()
    }

    const isOnSale = (card: OriginalCard) => {
        if (card.orders?.sell_orders) {
            const sellOrders = card.orders?.sell_orders;
            return sellOrders.some((orders) => orders.user === user?.walletAddress && orders.status === "active")
        }
        return false
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