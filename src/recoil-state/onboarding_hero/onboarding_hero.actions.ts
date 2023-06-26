import { useRecoilValue, useSetRecoilState } from "recoil";
import { Alignment, IClass, IFantasyRace, onboardingHeroAtom } from "./onboarding_hero.atom";

export function useOnboardingHeroActions() {
    const setOnboardingHero = useSetRecoilState(onboardingHeroAtom);
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom)

    return {
        setPlayerName,
        setFantasyRace,
        setClass,
        setAlignment,
        setDescription,
        setImageOptions
    };

    function setPlayerName(playerName: string) {
        setOnboardingHero((state: any) => ({
            ...state,
            playerName: playerName
        }))
    }

    function setFantasyRace(fantasyRace: IFantasyRace) {
        setOnboardingHero((state: any) => ({
            ...state,
            fantasyRace: fantasyRace
        }))
    }

    function setClass(fantasyClass: IClass) {
        setOnboardingHero((state: any) => ({
            ...state,
            class: fantasyClass
        }))
    }

    function setAlignment(alignment: Alignment) {
        setOnboardingHero((state: any) => ({
            ...state,
            alignment: alignment
        }))
    }

    function setDescription(description: string[]) {
        setOnboardingHero((state: any) => ({
            ...state,
            description: description
        }))
    }

    function setImageOptions(images: string[]) {
        setOnboardingHero((state: any) => ({
            ...state,
            imageOptions: images
        }))
    }

}