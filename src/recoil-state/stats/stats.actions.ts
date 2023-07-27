import { useRecoilValue, useSetRecoilState } from "recoil";
import { statsAtom } from "./stats.atom";

export function useStatsActions() {
    const setStats = useSetRecoilState(statsAtom);
    const statsState = useRecoilValue(statsAtom)

    return {
        setFantasyRacesPlayedByAmount,
        setPlayerClassesPlayedByAmount,
        setAlignmentByAmount,
    }

    function setFantasyRacesPlayedByAmount(amount: number) {
        setStats((state: any) => ({
            ...state,
            fantasyRacesPlayedBy: amount
        }))
    }

    function setPlayerClassesPlayedByAmount(amount: number) {
        setStats((state: any) => ({
            ...state,
            playerClassesPlayedBy: amount
        }))
    }

    function setAlignmentByAmount(amount: number) {
        setStats((state: any) => ({
            ...state,
            alignmentPlayedBy: amount
        }))
    }
}