import { useRecoilValue, useSetRecoilState } from "recoil";
import { defaultRacesAtom } from "./default_races.atom";
import { RaceDocument } from "@/pages/api/schemas/race_schema";

export function useDefaultRacesActions() {
    const setDefaultRaces = useSetRecoilState(defaultRacesAtom);

    return {
        setRaces,
        handleDoneSetRaces
    };

    function setRaces(races: RaceDocument[]) {
        setDefaultRaces((state: any) => ({
            ...state,
            fetched: true,
            races: races
        }))
    }

    function handleDoneSetRaces() {
        setDefaultRaces((state: any) => ({
            ...state,
            doneSet: true
        }))
    }
}