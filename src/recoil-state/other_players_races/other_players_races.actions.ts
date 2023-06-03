import { useRecoilValue, useSetRecoilState } from "recoil";
import { otherPlayersRacesAtom } from "./other_players_races.atom";
import { RaceDocument } from "@/pages/api/schemas/race_schema";

export function useOtherPlayersRacesActions() {
    const setOtherPlayersRaces = useSetRecoilState(otherPlayersRacesAtom);

    return {
        setRaces,
        handleDoneSetRaces
    };

    function setRaces(races: any[]) {
        setOtherPlayersRaces((state: any) => ({
            ...state,
            fetched: true,
            races: races
        }))
    }

    function handleDoneSetRaces() {
        setOtherPlayersRaces((state: any) => ({
            ...state,
            doneSet: true
        }))
    }
}