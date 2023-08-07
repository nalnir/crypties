import { ITab } from "@/utils"
import { ButtonCustom } from "@/shared"
import { useState } from "react"
import DefaultDeckGenerator from "./default_deck_generator"
import DefautlCardGenerator from "./default_card_generator"

export default function DefautlCardAndDeckGenerator() {
    const [activeTab, setActiveTab] = useState(0)
    const tabs: ITab[] = [
        {
            title: "DECK GENERATOR",
            component: <DefaultDeckGenerator />
        },
        {
            title: "CARD GENERATOR",
            component: <DefautlCardGenerator />
        },
    ]

    return <div className="flex-col items-start justify-start space-y-3">
        <div className="flex items-center justify-center w-full space-x-3">
            {tabs.map((tab, index) => <ButtonCustom textClassName="text-black" className={`${activeTab === index ? 'bg-secondary-400' : 'bg-white'}`} key={index} title={tab.title} onClick={() => setActiveTab(index)} />)}
        </div>
        {tabs[activeTab].component}
    </div>
}