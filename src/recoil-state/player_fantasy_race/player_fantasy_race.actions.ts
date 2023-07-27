import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerFantasyRaceAtom } from "./player_fantasy_race.atom";
import { RaceDocument } from "@/pages/api/schemas/race_schema";

export function usePlayerFantasyRaceActions() {
    const setPlayerFantasyRace = useSetRecoilState(playerFantasyRaceAtom);
    const playerFantasyRaceState = useRecoilValue(playerFantasyRaceAtom)

    return {
        setImageOptions,
        setImageChoice,
        setFetched,
        setRace,
        setName,
        setNameCombinations
    };

    function setRace(race: RaceDocument) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            race: race
        }))
    }

    function setName(name: string) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            name: name
        }))
    }

    function setNameCombinations(nameCombinations: string[]) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            nameCombinations: nameCombinations
        }))
    }


    function setImageOptions(images: string[]) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            imageOptions: images
        }))
    }

    function setImageChoice(image: string) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            imageChoice: image
        }))
    }


    function setFetched(fetched: boolean) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            fetched: fetched
        }))
    }


}