import { PText } from "@/shared/components/p_text"
import { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useOnboardingHeroActions } from "@/recoil-state/onboarding_hero/onboarding_hero.actions";
import { useRecoilValue } from "recoil";
import { Alignment, onboardingHeroAtom } from "@/recoil-state/onboarding_hero/onboarding_hero.atom";

export const Step4 = () => {
    const onboardingHeroActions = useOnboardingHeroActions();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);
    const { data } = trpc.register.useMutation();
    const [selected, setSelected] = useState<Alignment>(onboardingHeroState.alignment);

    useEffect(() => {
        setSelected(onboardingHeroState.alignment)
    },[onboardingHeroState.alignment])

    return <div className={`grid items-center justify-between w-screen h-screen grid-cols-2 p-3 bg-primary-400`}>
        <div onClick={() => onboardingHeroActions.setAlignment("light")} className={`${selected === 'light' ? 'bg-secondary-400' : 'bg-primary-500'} flex items-center justify-center h-full border-r-2 border-white cursor-pointer hover:bg-opacity-50`}>
            <PText>Light</PText>
        </div>
        <div onClick={() => onboardingHeroActions.setAlignment("darkness")} className={`${selected === 'darkness' ? 'bg-secondary-400' : 'bg-primary-500'} flex items-center justify-center h-full cursor-pointer hover:bg-opacity-50`}>
            <PText>Darkness</PText>
        </div>
    </div>
}