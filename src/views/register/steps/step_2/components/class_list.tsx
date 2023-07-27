import { PlayerClassDocument } from "@/pages/api/schemas/class_schema"
import { RaceDocument } from "@/pages/api/schemas/race_schema"
import { PText } from "@/shared"

interface ClassListComponentProps {
    playerClass?: PlayerClassDocument,
    setActiveClass: (playerClass: PlayerClassDocument) => void,
    activeClass?: PlayerClassDocument,
    defaultClasses?: PlayerClassDocument[],
    otherPlayersClasses?: PlayerClassDocument[],
    setClass: (id: string, name: string) => void
}

export const ClassListComponent = ({ playerClass, setActiveClass, activeClass, defaultClasses, otherPlayersClasses, setClass }: ClassListComponentProps) => {
    return <div className="space-y-3">
        {playerClass ?
            <div className="cursor-pointer" onClick={() => {
                setClass(playerClass?._id ?? '', playerClass?.name ?? '')
                setActiveClass(playerClass)
            }}>
                <PText className={`text-xl ${activeClass?._id === playerClass?._id ? 'text-secondary-400' : 'text-white'}`}>{playerClass?.name}</PText>
            </div> : <></>
        }
        {defaultClasses?.map((playerClass, index) => <div key={index} className="cursor-pointer" onClick={() => {
            setClass(playerClass._id, playerClass.name)
            setActiveClass(playerClass)
        }}>
            <PText className={`text-xl ${activeClass?._id === playerClass._id ? 'text-secondary-400' : 'text-white'}`}>{playerClass.name}</PText>
        </div>
        )}
        {otherPlayersClasses?.map((playerClass, index) => <div key={index} className="cursor-pointer" onClick={() => {
            setClass(playerClass._id, playerClass.name)
            setActiveClass(playerClass)
        }}>
            <PText className={`text-xl ${activeClass?._id === playerClass._id ? 'text-secondary-400' : 'text-white'}`}>{playerClass.name}</PText>
        </div>
        )}
    </div>
}