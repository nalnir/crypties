import { PText } from "./p_text";

interface StepperProps {
    totalSteps: number
    activeStep: number
}
export const Stepper = ({
    totalSteps,
    activeStep
}: StepperProps) => {
    const arraySteps: number[] = Array.from({length: totalSteps}, (_, index) => index);
    return <div className="flex items-center justify-center p-3 space-x-3 bg-secondary-400">
        {arraySteps.map((step: number, index: number) => <div className="flex items-center" key={index}>
            <div className={`p-3 ${activeStep === step ? 'bg-primary-400' : 'bg-primary-500'} rounded-full justify-center items-center`}>
            <PText>{(step + 1).toString()}</PText>
            </div>
            {index < arraySteps.length -1 ? <PText className="pl-3">-</PText> : <></>}
        </div>)}
    </div>
}