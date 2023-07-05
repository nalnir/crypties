import Image from 'next/image';
import { PText } from "@/shared/components/p_text";
import { useEffect, useState } from "react";
import { Step4 } from "./steps/step_4";
import { Step2 } from "./steps/step_2/step_2";
import { Stepper } from "@/shared/components/stepper";
import { Step1 } from "./steps/step_1/step_1";
import { Step3 } from "./steps/step_3/step_3";
import { trpc } from "@/utils/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import Board2D from "../2D/board2D";
import { useRecoilValue } from "recoil";
import { onboardingHeroAtom } from "@/recoil-state/onboarding_hero/onboarding_hero.atom";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { useUserActions } from '@/recoil-state/user/user.actions';
import { useErrorSuccessActions } from '@/recoil-state/error_success/error_success.actions';
import { ErrorSuccessType } from '@/recoil-state/error_success/error_success.atom';
import { generateFantasyName } from '@/utils/functions/generate_fantasy_name';
import { useOnboardingHeroActions } from '@/recoil-state/onboarding_hero/onboarding_hero.actions';
import { useProgressiveLoaderActions } from '@/recoil-state/progressive_loader/progressive_loader.actions';
import { MainCanvas } from '../3D/main_canvas';

function Register() {
    const [activeStep, setActiveStep] = useState(0)
    const [loading, setLoading] = useState(false)

    const progressiveLoaderActions = useProgressiveLoaderActions();
    const globalModal = useGlobalModalActions();
    const errorSuccessActions = useErrorSuccessActions();
    const queryClient = useQueryClient();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);
    const onboardingHeroActions = useOnboardingHeroActions();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const getUser = trpc.getUser.useMutation()
    const registerUser = trpc.register.useMutation()
    const generateUserAvatarImages = trpc.generateImages.useMutation()
    const bumpPlayedByAmountFantasyRace = trpc.bumpPlayedByAmountFantasyRace.useMutation();
    const bumpPlayedByAmoungPlayerClass = trpc.bumpPlayedByAmoungPlayerClass.useMutation();
    const onboardFuture = trpc.onboardUser.useMutation()

    const imxWallet = localStorage.getItem('WALLET_ADDRESS')

    // useEffect(() => {
    //     if(isConnected && address) {
    //         handleGetUser(address)
    //     } else if(!isConnected) {
    //         queryClient.removeQueries(['user']);
    //     }
    // }, [isConnected])

    useEffect(() => {
        if(imxWallet) {
            handleGetUser(imxWallet)
        } else {
            queryClient.removeQueries(['user']);
        }
    },[imxWallet])

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

            progressiveLoaderActions.setActiveStep({ position: 2, description: 'Bumping fantasy race playedBy amount'})
            const bumpPlayedByAmountFantasyRaceRes = await bumpPlayedByAmountFantasyRace.mutateAsync({
                fantasyRaceID: onboardingHeroState.fantasyRace.id
            })

            progressiveLoaderActions.setActiveStep({ position: 3, description: 'Bumping class playedBy amount'})
            const bumpPlayedByAmoungPlayerClassRes = await bumpPlayedByAmoungPlayerClass.mutateAsync({
                playerClassID: onboardingHeroState.class.id
            })

            const generatedFantasyName = generateFantasyName(user.walletAddress)
            progressiveLoaderActions.setActiveStep({ position: 4, description: 'Finalizing hero creation'})
            const updatedUser = await onboardFuture.mutateAsync({
                walletAddress: user.walletAddress,
                profilePicture: image,
                generatedName: generatedFantasyName,
                playerName: onboardingHeroState.playerName.length > 0 ? onboardingHeroState.playerName : generatedFantasyName
            })
            queryClient.setQueryData(['user'], updatedUser);
            progressiveLoaderActions.closeProgressiveLoader()
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
        progressiveLoaderActions.openProgressiveLoader(4, { position: 1, description: 'Generating avatar images' })
        const images = await generateUserAvatarImages.mutateAsync({
            prompt: `PORTRAIT, CUTE PIXAR ANIMATION STYLE ${onboardingHeroState.alignment === "darkness" ? 'Evil' : 'Good'}, ${onboardingHeroState.description}, ${onboardingHeroState.fantasyRace.name}, ${onboardingHeroState.class.name}, portrait, fantasy, centered, 4k resolution, bright color, ${onboardingHeroState.alignment === "darkness" ? 'dark gloomy' : 'beautiful bright'} background, pixar style`,
            negative_prompt: 'HALF FACE, CROPED IMAGE, watermark, ugly, weird face, double head, double face, multiple face, multiple head, multiple body, disfigured hand, disproportion body, incorrect hands, extra limbs, extra fingers, fused fingers, missing facial features, low quality, bad quality, bad anatomy, Missing limbs, missing fingers, ugly',
            modelId: '6c95de60-a0bc-4f90-b637-ee8971caf3b0',
            promptMagic: true
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

    if(user?.onboarded) {
        return <div className="flex-col">
        <Stepper totalSteps={steps.length} activeStep={activeStep} selectStep={(index: number) => setActiveStep(index)}/>
            {steps[activeStep].component}
            <div className="grid grid-cols-2 bg-secondary-400">
                <div onClick={prevStep} className="flex items-center justify-center cursor-pointer"><PText>PREV</PText></div>
                <div onClick={steps[activeStep].function} className="flex items-center justify-center cursor-pointer"><PText>{(steps.length - 1) === activeStep ? "CREATE": "NEXT"}</PText></div>
            </div>
        </div>
    } else {
        // return <Board2D />
        return <div className='w-screen h-screen'>
            <MainCanvas/>
        </div>
    }
}

export default Register;