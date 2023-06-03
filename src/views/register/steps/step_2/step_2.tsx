import { FormikProps } from "formik";
import { RegisterUserFormik } from "../../validation_scheme";
import Image from 'next/image';
import { PText } from "@/shared/components/p_text";
import { useQuery } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import useStateCallback from "@/utils/hooks/use_state_callback";
import { useState } from "react";
import { useOnboardingHeroActions } from "@/recoil-state/onboarding_hero/onboarding_hero.actions";
import { ClassCreatorComponent } from "./components/class_creator_component";
import { ClassProps, classList } from "@/utils/data/classes";

interface Step2Props {
    formik: FormikProps<RegisterUserFormik>;
    nextStep: () => void;
}

export const Step2 = ({
    formik,
    nextStep
}: Step2Props) => {
    const [activeClass, setActiveClass] = useState(0)
    const [copyClassList, setCopyClassList] = useStateCallback<ClassProps[]>(JSON.parse(JSON.stringify(classList)));
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const onboardingHeroActions = useOnboardingHeroActions();

    return <div className="grid w-screen h-screen grid-cols-12 bg-primary-400">
    <div className="flex justify-center col-span-8 overflow-hidden">
        <div className="flex items-center justify-center h-full">
            <Image width={512} height={512} className="object-contain max-w-full max-h-full" src={copyClassList[activeClass].img} alt={copyClassList[activeClass].name} />
        </div>
    </div>

    <div className="flex flex-col justify-between col-span-4 p-3 bg-primary-500">
        <div className="space-y-5">
            <div className="space-y-3">
                {copyClassList.map((fantasyClass, index) => <div key={index} className="cursor-pointer" onClick={() => {
                    onboardingHeroActions.setClass(fantasyClass.name)
                    setActiveClass(index)
                }}>
                    <PText className={`text-xl ${activeClass === index ? 'text-secondary-400' : 'text-white'}`}>{fantasyClass.name}</PText>
                </div>
                )}
            </div>
            <ClassCreatorComponent />
        </div>
        <div>
            <PText className='text-xl text-white'>{copyClassList[activeClass].description}</PText>
        </div>
    </div>
</div>
}