import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useStatsActions } from "@/recoil-state/stats/stats.actions";
import { statsAtom } from "@/recoil-state/stats/stats.atom";
import { ButtonCustom, PText } from "@/shared";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { trpc } from "@/utils/trpc";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from 'flowbite-react';
import { useState } from "react";
import { useRecoilValue } from "recoil";
import AvatarTab from "./components/tabs/avatar";
import CardDecksTab from "./components/tabs/card_decks";
import CardMarketPlaceTab from "./components/tabs/card_marketplace";

interface ITabButton {
    title: string,
}
interface ITab {
    title: string,
    component: JSX.Element
}
function MainMenu() {

    const [activeTab, setActiveTab] = useState(2)

    const tabButtons: ITabButton[] = [
        { title: "CARD DECKS" },
        { title: "CARD MARKETPLACE" },
        { title: "AVATAR" }
    ]

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

    return <div className="grid grid-cols-2 bg-primary-400">
        <div className="flex items-center justify-center p-3">
            {tabs[activeTab].component}
        </div>
        <div className="flex-col items-center justify-center p-3 space-y-3">
            <ButtonCustom onClick={() => { }} title="PLAY" />
            {tabButtons.map((item, index) => (
                <ButtonCustom key={index} className={`${index === activeTab ? 'bg-primary-500' : 'bg-white'}`} textClassName="text-black" onClick={() => setActiveTab(index)} title={item.title} />
            ))}
        </div>
    </div>
}

export default MainMenu;