import { FormikProps } from "formik";
import { RegisterUserFormik } from "../../validation_scheme";
import { racesList } from "@/utils/data/races";
import { PText } from "@/shared/components/p_text";
import { useState } from "react";
import { RaceCreatorComponent } from "./components/race_creator_component";

interface Step1Props {
    formik: FormikProps<RegisterUserFormik>;
    nextStep: () => void;
}
export const Step1 = ({
    formik,
    nextStep
}: Step1Props) => {
    const [activeRace, setActiveRace] = useState(0)
    return <div className="grid w-screen h-screen grid-cols-12 bg-primary-400">
        <div className="flex justify-center col-span-8 overflow-hidden">
            <div className="flex items-center justify-center h-full">
                <img className="object-contain max-w-full max-h-full" src={racesList[activeRace].img} alt={racesList[activeRace].name} />
            </div>
        </div>

        <div className="flex flex-col justify-between col-span-4 p-3 bg-primary-500">
            <div className="space-y-5">
                <div className="space-y-3">
                    {racesList.map((race, index) => <div key={index} className="cursor-pointer" onClick={() => setActiveRace(index)}>
                            <PText className={`text-xl ${activeRace === index ? 'text-secondary-400' : 'text-white'}`}>{race.name}</PText>
                        </div>
                    )}
                </div>
                <RaceCreatorComponent />
            </div>
            <div>
                <PText className='text-xl text-white'>{racesList[activeRace].description}</PText>
            </div>
        </div>
    </div>
}