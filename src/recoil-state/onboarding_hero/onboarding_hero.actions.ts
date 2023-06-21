import { useRecoilValue, useSetRecoilState } from "recoil";
import { Alignment, onboardingHeroAtom } from "./onboarding_hero.atom";

export function useOnboardingHeroActions() {
    const setOnboardingHero = useSetRecoilState(onboardingHeroAtom);
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom)

    return {
        setFantasyRace,
        setClass,
        setAlignment,
        setDescription,
    };

    function setFantasyRace(fantasyRace: string) {
        setOnboardingHero((state: any) => ({
            ...state,
            fantasyRace: fantasyRace
        }))
    }

    function setClass(fantasyClass: string) {
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

}