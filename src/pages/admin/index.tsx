import { SuperAdminGuard } from "@/guards/superadmin_guard";
import { ButtonCustom, HeaderMain } from "@/shared/components";
import { ITab } from "@/utils";
import { useState } from "react";
import { GameSettings } from "./tabs/game_settings";
import { GeneralSettings } from "./tabs/general_settings";
import { DefautlCardAndDeckGenerator } from "./tabs/default_card_and_deck_generator";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState(0);

    const tabs: ITab[] = [
        {
            title: "DEFAULT CARD AND DECK GENERATOR",
            component: <DefautlCardAndDeckGenerator />
        },
        {
            title: "GAME SETTINGS",
            component: <GameSettings />
        },
        {
            title: "GENERAL SETTINGS",
            component: <GeneralSettings />
        }
    ]

    return <SuperAdminGuard>
        <div className="h-screen bg-primary-400">
            <HeaderMain onAdminSite={true} />
            <div className="grid grid-cols-2 p-3 space-x-3">
                <div className="flex items-center justify-center">
                    {tabs[activeTab].component}
                </div>
                <div className="flex-col items-center justify-center space-y-3">
                    {tabs.map((tab, index) => <ButtonCustom textClassName="text-black" className={activeTab === index ? 'bg-secondary-400' : 'bg-primary-500'} key={index} title={tab.title} onClick={() => setActiveTab(index)} />)}
                </div>
            </div>
        </div>
    </SuperAdminGuard>
}