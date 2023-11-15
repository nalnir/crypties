import Image from 'next/image';
import { PText } from "@/shared/components/p_text";
import { useQuery } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import useStateCallback from "@/utils/hooks/use_state_callback";
import { useEffect, useState } from "react";
import { useOnboardingHeroActions } from "@/recoil-state/onboarding_hero/onboarding_hero.actions";
import { ClassCreatorComponent } from "./components/class_creator_component";
import { ClassProps, classList } from "@/utils/data/classes";
import { useRecoilValue } from "recoil";
import { playerClassAtom } from "@/recoil-state/player_class/player_class.atom";
import { usePlayerClassActions } from "@/recoil-state/player_class/player_class.actions";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { OtherPlayersClassesState, otherPlayersClassesAtom } from "@/recoil-state/other_players_classes/other_players_classes.atom";
import { onboardingHeroAtom } from '@/recoil-state/onboarding_hero/onboarding_hero.atom';
import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { useDefaultClassesActions } from '@/recoil-state/default_classes/default_classes.actions';
import { defaultClassesAtom } from '@/recoil-state/default_classes/default_classes.atom';
import { ClassListComponent } from './components/class_list';
import { api } from '@/utils/api';

export const Step2 = () => {
    const globalModal = useGlobalModalActions();
    const playerClassState = useRecoilValue(playerClassAtom)
    const playerClassActions = usePlayerClassActions();
    const otherPlayerClassesState = useRecoilValue(otherPlayersClassesAtom)
    const defaultClassesState = useRecoilValue(defaultClassesAtom)
    const defaultClassesActions = useDefaultClassesActions();
    const [activeClass, setActiveClass] = useState<PlayerClassDocument | undefined>()
    const [playerClassList, setPlayerClassList] = useState<PlayerClassDocument[]>([]);
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const onboardingHeroActions = useOnboardingHeroActions();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);

    const generateDescription = api.ai.generateDescription.useMutation();
    const saveUserPlayerClass = api.user.saveUserPlayerClass.useMutation();
    const getUserClass = api.user.getUserClass.useMutation();
    const getDefaultClasses = api.playerClass.getDefaultClasses.useMutation();

    const getAllDefaultClasses = async () => {
        if (!defaultClassesState.fetched) {
            const allDefaultClasses = await getDefaultClasses.mutateAsync()
            console.log('allDefaultClasses: ', allDefaultClasses)
            defaultClassesActions.setClasses(allDefaultClasses as any)
            if (!playerClassState.playerClass && allDefaultClasses) {
                setActiveClass(allDefaultClasses[0] as any)
            }
        }
    }

    useEffect(() => {
        getAllDefaultClasses()
    }, [])

    useEffect(() => {
        if (onboardingHeroState.class.id.length > 0) {
            const allClasses: PlayerClassDocument[] = [...defaultClassesState.classes as any, ...otherPlayerClassesState.classes as any, playerClassState.playerClass as any]
            const chosenClass = allClasses.find((playerClass) => playerClass._id === onboardingHeroState.class.id)
            console.log('chosenClass: ', chosenClass)
            if (chosenClass) {
                setActiveClass(chosenClass)
            }
        }
    }, [onboardingHeroState.class])

    useEffect(() => {
        if (playerClassState.imageOptions.length > 0) {
            globalModal.openGlobalModal(<div className="grid grid-cols-2 gap-3">
                {playerClassState.imageOptions.map((image, index) => <img className="cursor-pointer" onClick={() =>
                    handlePlayerChoice(image)
                } alt="Player fantasy race option" key={index} src={image} width={1024} height={1024} />)}
            </div>)
        }
    }, [playerClassState.imageOptions])

    const handlePlayerChoice = async (image: string) => {
        playerClassActions.setImageChoice(image)
        globalModal.closeGlobalModal()
        const generatedDescription = await generateDescription.mutateAsync({
            prompt: `Describe ${playerClassState.name} class in fantasy style. LESS then 40 words.`
        })

        // 3. UPLOAD RACE NAME, DESCRIPTION, IMAGE TO MONGODB
        const playerClass = await saveUserPlayerClass.mutateAsync({
            name: playerClassState.name,
            description: generatedDescription ?? '',
            image: image,
            creatorAddress: user?.walletAddress ?? '',
            nameCombinations: playerClassState.nameCombinations,
            default: false
        });
        playerClassActions.setImageOptions([])

        playerClassActions.setClass(playerClass as any)
        setActiveClass(playerClass as any)
        playerClassActions.setFetched(true);
    }

    useEffect(() => {
        if (user && !playerClassState.fetched) {
            getPlayerClass()
        }
    }, [user])

    const getPlayerClass = async () => {
        const currentClass = await getUserClass.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })
        if (currentClass) {
            playerClassActions.setClass(currentClass as any)
            playerClassActions.setFetched(true)
        }
    }

    return <div className="grid w-screen h-screen grid-cols-12 bg-primary-400">
        <div className="flex justify-center col-span-8 overflow-hidden">
            <div className="flex items-center justify-center h-full">
                <img width={512} height={512} className="object-contain max-w-full max-h-full" src={`${activeClass?.image}?v=${activeClass?._id}`} alt={activeClass?.name ?? ''} />
            </div>
        </div>

        <div className="flex flex-col justify-between col-span-4 p-3 bg-primary-500">
            <div className="space-y-5">
                <ClassListComponent
                    setActiveClass={(playerClass) => setActiveClass(playerClass)}
                    setClass={(id: string, name: string) => onboardingHeroActions.setClass({ id: id, name: name })}
                    playerClass={playerClassState.playerClass}
                    activeClass={activeClass}
                    defaultClasses={defaultClassesState.classes}
                    otherPlayersClasses={otherPlayerClassesState.classes}
                />
                <ClassCreatorComponent />
            </div>
            <div>
                <PText className='text-xl text-white'>{activeClass?.description ?? ''}</PText>
            </div>
        </div>
    </div>
}