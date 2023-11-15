import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useStatsActions } from "@/recoil-state/stats/stats.actions";
import { statsAtom } from "@/recoil-state/stats/stats.atom";
import { ButtonCustom, PText } from "@/shared";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from 'flowbite-react';
import { useState } from "react";
import { useRecoilValue } from "recoil";
import AvatarTab from "./components/tabs/avatar";
import CardDecksTab from "./components/tabs/card_decks/card_decks";
import CardMarketPlaceTab from "./components/tabs/card_marketplace";
import { ITab } from "@/utils";
import { useRouter } from "next/router";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import BattleDeckChoiceModal from "./components/battle_deck_choice_modal";
import { api } from "@/utils/api";


function MainMenu() {
    const [activeTab, setActiveTab] = useState(2)
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const getUserDecks = api.user.getUserDecks.useQuery({ walletAddress: user?.walletAddress ?? '' })
    const errorSuccessActions = useErrorSuccessActions();
    const globalModal = useGlobalModalActions();

    const allDecks = getUserDecks.data ?? [];

    const tabs: ITab[] = [
        {
            title: "CARD DECKS",
            component: <CardDecksTab />
        },
        {
            title: "CARD MARKETPLACE",
            component: <CardMarketPlaceTab />
        },
        {
            title: "AVATAR",
            component: <AvatarTab />
        }
    ]

    const initiateMatch = () => {
        const playableDecks: any[] = []
        allDecks.forEach((deck) => {
            if (deck.cards.length === 30) {
                playableDecks.push(deck);
            }
        })
        if (playableDecks.length === 0) {
            errorSuccessActions.openErrorSuccess("You don't have a deck of 30");
            return
        }
        globalModal.openGlobalModal(<BattleDeckChoiceModal playableDecks={playableDecks} />)
    }

    return <div className="grid grid-cols-2 gap-3 p-3 bg-primary-400">
        <div className="flex items-start justify-start">
            {tabs[activeTab].component}
        </div>
        <div className="flex-col items-center justify-center space-y-3">
            <ButtonCustom onClick={() => initiateMatch()} title="PLAY" />
            {tabs.map((item, index) => (
                <ButtonCustom key={index} className={`${index === activeTab ? 'bg-primary-500' : 'bg-white'}`} textClassName="text-black" onClick={() => setActiveTab(index)} title={item.title} />
            ))}
        </div>
    </div>
}

export default MainMenu;