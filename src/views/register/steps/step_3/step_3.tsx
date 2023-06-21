import { RegisterUserFormik, registerUserFormFields } from "../../validation_scheme";
import { PText } from "@/shared/components/p_text";
import useStateCallback from "@/utils/hooks/use_state_callback";
import { useEffect } from "react";
import { useOnboardingHeroActions } from "@/recoil-state/onboarding_hero/onboarding_hero.actions";
import { useRecoilValue } from "recoil";
import { onboardingHeroAtom } from "@/recoil-state/onboarding_hero/onboarding_hero.atom";

export const Step3 = () => {
    const [chosenDescriptors, setChosenDescriptors] = useStateCallback<string[]>([])
    const onboardingHeroActions = useOnboardingHeroActions();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);

    useEffect(() => {
        setChosenDescriptors([...onboardingHeroState.description])
    },[onboardingHeroState.description])
    
    const basicDescriptors: string[] = [
        "Masculine",
        "Feminine",
        "Tall",
        "Short",
        "Slender",
        "Muscular",
        "Lean",
        "Curvy",
        "Athletic",
        "Broad-shouldered",
        "Petite",
        "Chiseled",
        "Plump",
        "Bulky",
        "Frail",
        "Agile",
        "Graceful",
        "Scarred",
        "Tattooed",
        "Pierced",
        "Dainty",
        "Wild-haired",
    ]

    const toggleDescriptor = (index: number) => {
        const arrNewDescriptors: string[] = chosenDescriptors;
        const chosenDescriptorsIdx = arrNewDescriptors.findIndex((descriptor: string) => descriptor === basicDescriptors[index])

        if(chosenDescriptorsIdx > -1) {
            arrNewDescriptors.splice(chosenDescriptorsIdx, 1)
            setChosenDescriptors([...arrNewDescriptors], (state) => {
                onboardingHeroActions.setDescription([...state])
            })
        } else {
            arrNewDescriptors.push(basicDescriptors[index])
            setChosenDescriptors([...arrNewDescriptors], (state) => {
                onboardingHeroActions.setDescription([...state])
            })   
        }
    }

    const isPicked = (index: number) => {
        const idx = chosenDescriptors.findIndex((descriptor) => descriptor === basicDescriptors[index])
        if(idx < 0) {
            return false;
        }
        return true;
    }

    return <div className="w-screen h-screen p-3 bg-primary-400">
        <div className="grid items-center justify-center grid-cols-5 gap-5 mx-20 my-20">
            {basicDescriptors.map((descriptor, index) => <div 
                    key={index} 
                    className={`${isPicked(index) ? 'bg-secondary-400' : 'bg-white'} flex items-center justify-center p-3 text-black rounded-lg cursor-pointer hover:bg-primary-500`}
                    onClick={() => toggleDescriptor(index)}
                >
                    <PText>{descriptor}</PText>
            </div>)}
        </div>
    </div>
}