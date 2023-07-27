import { useSetRecoilState } from "recoil";
import { defaultClassesAtom } from "./default_classes.atom";
import { PlayerClassDocument } from "@/pages/api/schemas/class_schema";

export function useDefaultClassesActions() {
    const setDefaultClasses = useSetRecoilState(defaultClassesAtom);

    return {
        setClasses,
        handleDoneSetClasses
    };

    function setClasses(classes: PlayerClassDocument[]) {
        setDefaultClasses((state: any) => ({
            ...state,
            fetched: true,
            classes: classes
        }))
    }

    function handleDoneSetClasses() {
        setDefaultClasses((state: any) => ({
            ...state,
            doneSet: true
        }))
    }
}