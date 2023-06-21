import { PText } from "@/shared/components/p_text";
import { useEffect, useState } from "react";
import { Step4 } from "./steps/step_4";
import { Step2 } from "./steps/step_2/step_2";
import { Stepper } from "@/shared/components/stepper";
import { Step1 } from "./steps/step_1/step_1";
import { Step3 } from "./steps/step_3/step_3";
import { trpc } from "@/utils/trpc";
import { useAccount } from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import Board2D from "../2D/board2D";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRecoilValue } from "recoil";
import { onboardingHeroAtom } from "@/recoil-state/onboarding_hero/onboarding_hero.atom";

function Register() {
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(false)
    const queryClient = useQueryClient();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const { address, isConnected } = useAccount()
    const getUser = trpc.getUser.useMutation()
    const registerUser = trpc.register.useMutation()

    const handleGetUser = async (walletAddress: string) => {
        const currentUser = await getUser.mutateAsync({ walletAddress: walletAddress })
        if(currentUser) {
            queryClient.setQueryData(['user'], currentUser);
        } else{
            const newUser = await registerUser.mutateAsync({
                walletAddress: walletAddress
            })
            queryClient.setQueryData(['user'], newUser);
        }
    }

    useEffect(() => {
        if(isConnected && address) {
            handleGetUser(address)
        } else if(!isConnected) {
            queryClient.removeQueries(['user']);
        }
    }, [isConnected])
    


    const submit = async () => {
        setLoading(true)
        console.log('onboardingHeroState: ', onboardingHeroState)
        setLoading(false)
    }

    const nextStep = () => {
        setActiveStep(activeStep + 1)
    }

    const prevStep = () => {
        if(activeStep === 0) { return }
        setActiveStep(activeStep - 1)
    }

    const steps: Array<{ component: JSX.Element, function: () => void }> = [
        {
            component: <Step1 key={activeStep} />,
            function: () => nextStep()
        },
        {
            component: <Step2 key={activeStep} />,
            function: () => nextStep()
        },
        {
            component: <Step3 key={activeStep} />,
            function: () => nextStep()
        },
        {
            component: <Step4 key={activeStep} />,
            function: () => submit()
        }
    ]


    if(!user) {
        return <div className="flex-col items-center justify-center w-screen h-screen p-3 bg-primary-400">
            <ConnectButton />
        </div>
    } else if(!user.onboarded) {
        return <div className="flex-col">
        <Stepper totalSteps={steps.length} activeStep={activeStep}/>
            {steps[activeStep].component}
            <div className="grid grid-cols-2 bg-secondary-400">
                <div onClick={prevStep} className="flex items-center justify-center cursor-pointer"><PText>PREV</PText></div>
                <div onClick={steps[activeStep].function} className="flex items-center justify-center cursor-pointer"><PText>{(steps.length - 1) === activeStep ? "CREATE": "NEXT"}</PText></div>
            </div>
        </div>
    } else if(user.onboarded) {
        return <Board2D/>
    }
    return <div></div>
}

export default Register;