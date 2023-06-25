import Image from 'next/image';
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
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { useUserActions } from '@/recoil-state/user/user.actions';
import { useErrorSuccessActions } from '@/recoil-state/error_success/error_success.actions';
import { ErrorSuccessType } from '@/recoil-state/error_success/error_success.atom';
import { generateFantasyName } from '@/utils/functions/generate_fantasy_name';
import { useOnboardingHeroActions } from '@/recoil-state/onboarding_hero/onboarding_hero.actions';

function Register() {
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(false)

    const globalModal = useGlobalModalActions();
    const errorSuccessActions = useErrorSuccessActions();
    const queryClient = useQueryClient();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);
    const onboardingHeroActions = useOnboardingHeroActions();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const { address, isConnected } = useAccount()

    const getUser = trpc.getUser.useMutation()
    const registerUser = trpc.register.useMutation()
    const generateUserAvatarImages = trpc.generateImages.useMutation()
    const onboardFuture = trpc.onboardUser.useMutation()

    useEffect(() => {
        if(isConnected && address) {
            handleGetUser(address)
        } else if(!isConnected) {
            queryClient.removeQueries(['user']);
        }
    }, [isConnected])

    useEffect(() => {
        if(onboardingHeroState.imageOptions.length > 0) {
            globalModal.openGlobalModal(<div className="grid grid-cols-2 gap-3">
                {onboardingHeroState.imageOptions.map((image, index) => <Image className="cursor-pointer" onClick={() => 
                    handlePlayerChoice(image)
                } alt="Player fantasy race option" key={index} src={image} width={1024} height={1024}/>)}
            </div>)
        }
    },[onboardingHeroState.imageOptions])
    
    const handlePlayerChoice = async (image: string) => {
        globalModal.closeGlobalModal()
        if(user) {
            const generatedFantasyName = generateFantasyName(user.walletAddress)
            const updatedUser = await onboardFuture.mutateAsync({
                walletAddress: user.walletAddress,
                profilePicture: image,
                generatedName: generatedFantasyName,
                playerName: onboardingHeroState.playerName.length > 0 ? onboardingHeroState.playerName : generatedFantasyName
            })
            queryClient.setQueryData(['user'], updatedUser);
            errorSuccessActions.openErrorSuccess('User onboarded', ErrorSuccessType.SUCCESS)
        } else {
            errorSuccessActions.openErrorSuccess('Could not get the user', ErrorSuccessType.ERROR)
        }
    }

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
    
    const submit = async () => {
        setLoading(true)
        const images = await generateUserAvatarImages.mutateAsync({
            prompt: `ONE PERSON, ${onboardingHeroState.alignment === "darkness" ? 'Evil' : 'Good'}, ${onboardingHeroState.description}, ${onboardingHeroState.fantasyRace}, ${onboardingHeroState.class}, portrait, fantasy, centered, 4k resolution, bright color, ${onboardingHeroState.alignment === "darkness" ? 'dark gloomy' : 'beautiful bright'} background, pixar style`,
            negative_prompt: 'HALF FACE,CROPED IMAGE,watermark, ugly, weird face, double head, double face, multiple face, multiple head, multiple body, disfigured hand, disproportion body, incorrect hands, extra limbs, extra fingers, fused fingers, missing facial features, low quality, bad quality, bad anatomy, Missing limbs, missing fingers, ugly',
            modelId: 'a097c2df-8f0c-4029-ae0f-8fd349055e61'
        })
        const urls: string[] = []
        if(images) {
            images.forEach((image) => {
                if(image.url) {
                    urls.push(image.url)
                }
            })
            onboardingHeroActions.setImageOptions(urls)
        } else {
            errorSuccessActions.openErrorSuccess('Something went wrong. Did not get generated images.', ErrorSuccessType.ERROR)
        }
        
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


    console.log('USER REGISTER: ', user)

    if(!user) {
        return <div className="flex-col items-center justify-center w-screen h-screen p-3 bg-primary-400">
            <ConnectButton />
        </div>
    } else if(!user.onboarded) {
        return <div className="flex-col">
        <Stepper totalSteps={steps.length} activeStep={activeStep} selectStep={(index: number) => setActiveStep(index)}/>
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