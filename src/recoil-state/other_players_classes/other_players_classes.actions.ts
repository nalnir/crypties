import { useSetRecoilState } from "recoil";
import { otherPlayersClassesAtom } from "./other_players_classes.atom";

export function useOtherPlayersClassesActions() {
    const setOtherPlayersClasses = useSetRecoilState(otherPlayersClassesAtom);

    return {
        setClasses,
        handleDoneSetClasses
    };

    function setClasses(races: any[]) {
        setOtherPlayersClasses((state: any) => ({
            ...state,
            fetched: true,
            classes: races
        }))
    }

    function handleDoneSetClasses() {
        setOtherPlayersClasses((state: any) => ({
            ...state,
            doneSet: true
        }))
    }
}