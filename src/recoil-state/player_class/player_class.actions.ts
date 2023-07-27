import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerClassAtom } from "./player_class.atom";
import { PlayerClassDocument } from "@/pages/api/schemas/class_schema";

export function usePlayerClassActions() {
    const setPlayerClass = useSetRecoilState(playerClassAtom);
    const playerClassState = useRecoilValue(playerClassAtom)

    return {
        setName,
        setImageOptions,
        setImageChoice,
        setDescription,
        setFetched,
        setNameCombinations,
        setID,
        setClass
    };

    function setClass(playerClass: PlayerClassDocument) {
        setPlayerClass((state: any) => ({
            ...state,
            playerClass: playerClass
        }))
    }

    function setName(name: string) {
        setPlayerClass((state: any) => ({
            ...state,
            name: name
        }))
    }

    function setImageOptions(images: string[]) {
        setPlayerClass((state: any) => ({
            ...state,
            imageOptions: images
        }))
    }

    function setImageChoice(image: string) {
        setPlayerClass((state: any) => ({
            ...state,
            imageChoice: image
        }))
    }

    function setDescription(description: string) {
        setPlayerClass((state: any) => ({
            ...state,
            description: description
        }))
    }

    function setFetched(fetched: boolean) {
        setPlayerClass((state: any) => ({
            ...state,
            fetched: fetched
        }))
    }

    function setNameCombinations(nameCombinations: string[]) {
        setPlayerClass((state: any) => ({
            ...state,
            nameCombinations: nameCombinations
        }))
    }

    function setID(id: string) {
        setPlayerClass((state: any) => ({
            ...state,
            _id: id
        }))
    }
}