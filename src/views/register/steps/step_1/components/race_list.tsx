import { RaceDocument } from "@/pages/api/schemas/race_schema"
import { PText } from "@/shared"

interface RaceListComponentProps {
    playerFantasyRace?: RaceDocument,
    setActiveRace: (race: RaceDocument) => void,
    activeRace?: RaceDocument,
    defaultRaces?: RaceDocument[],
    otherPlayersRaces?: RaceDocument[],
    setFantasyRace: (id: string, name: string) => void
}

export const RaceListComponent = ({ playerFantasyRace, setActiveRace, activeRace, defaultRaces, otherPlayersRaces, setFantasyRace }: RaceListComponentProps) => {
    return <div className="space-y-3">
        {playerFantasyRace ?
            <div className="cursor-pointer" onClick={() => {
                setFantasyRace(playerFantasyRace?._id ?? '', playerFantasyRace?.name ?? '')
                setActiveRace(playerFantasyRace)
            }}>
                <PText className={`text-xl ${activeRace?._id === playerFantasyRace?._id ? 'text-secondary-400' : 'text-white'}`}>{playerFantasyRace?.name}</PText>
            </div> : <></>
        }
        {defaultRaces?.map((race, index) => <div key={index} className="cursor-pointer" onClick={() => {
            setFantasyRace(race._id, race.name)
            setActiveRace(race)
        }}>
            <PText className={`text-xl ${activeRace?._id === race._id ? 'text-secondary-400' : 'text-white'}`}>{race.name}</PText>
        </div>
        )}
        {otherPlayersRaces?.map((race, index) => <div key={index} className="cursor-pointer" onClick={() => {
            setFantasyRace(race._id, race.name)
            setActiveRace(race)
        }}>
            <PText className={`text-xl ${activeRace?._id === race._id ? 'text-secondary-400' : 'text-white'}`}>{race.name}</PText>
        </div>
        )}
    </div>
}