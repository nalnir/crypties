import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerFantasyRaceAtom } from "./player_fantasy_race.atom";

export function usePlayerFantasyRaceActions() {
    const setPlayerFantasyRace = useSetRecoilState(playerFantasyRaceAtom);
    const playerFantasyRaceState = useRecoilValue(playerFantasyRaceAtom)

    return {
        setName,
        setImageOptions,
        setImageChoice,
        setDescription,
        setFetched,
        setNameCombinations
    };

    function setName(name: string) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            name: name
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

    function setDescription(description: string) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            description: description
        }))
    }

    function setFetched(fetched: boolean) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            fetched: fetched
        }))
    }

    function setNameCombinations(nameCombinations: string[]) {
        setPlayerFantasyRace((state: any) => ({
            ...state,
            nameCombinations: nameCombinations
        }))
    }

}