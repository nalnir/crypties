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
import { trpc } from "@/utils/trpc";
import { otherPlayersClassesAtom } from "@/recoil-state/other_players_classes/other_players_classes.atom";
import { onboardingHeroAtom } from '@/recoil-state/onboarding_hero/onboarding_hero.atom';

export const Step2 = () => {
    const globalModal = useGlobalModalActions();
    const playerClassState = useRecoilValue(playerClassAtom)
    const playerClassActions = usePlayerClassActions();
    const otherPlayerClassesState = useRecoilValue(otherPlayersClassesAtom)
    const [activeClass, setActiveClass] = useState(0)
    const [copyClassList, setCopyClassList] = useStateCallback<ClassProps[]>(JSON.parse(JSON.stringify(classList)));
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const onboardingHeroActions = useOnboardingHeroActions();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);

    const generateDescription = trpc.generateDescription.useMutation();
    const saveUserPlayerClass = trpc.saveUserPlayerClass.useMutation();
    const getUserClass = trpc.getUserClass.useMutation();

    useEffect(() => {
        const existingHeroClassIndex = copyClassList.findIndex((heroClass: ClassProps) => heroClass.name === onboardingHeroState.class)
        if(existingHeroClassIndex > -1) {
            setActiveClass(existingHeroClassIndex)
        }
    },[onboardingHeroState.class])

    useEffect(() => {
        if(playerClassState.imageOptions.length > 0) {
            globalModal.openGlobalModal(<div className="grid grid-cols-2 gap-3">
                {playerClassState.imageOptions.map((image, index) => <Image className="cursor-pointer" onClick={() => 
                    handlePlayerChoice(image)
                } alt="Player fantasy race option" key={index} src={image} width={1024} height={1024}/>)}
            </div>)
        }
    },[playerClassState.imageOptions])

    useEffect(() => {
        if(otherPlayerClassesState.classes.length > 0) {
            const newRaces: ClassProps[] = []
            otherPlayerClassesState.classes.forEach((playerClass) => {
                newRaces.push({
                    name: playerClass.name,
                    img: playerClass.image,
                    description: playerClass.description
                })
            })
            setCopyClassList([...copyClassList, ...newRaces])
        }
    },[otherPlayerClassesState])

    const handlePlayerChoice = async (image: string) => {
        playerClassActions.setImageChoice(image)
        globalModal.closeGlobalModal()
        const generatedDescription = await generateDescription.mutateAsync({
            prompt: `Describe ${playerClassState.name} class in epic fantasy. Less then 40 words.`
        })
        playerClassActions.setDescription(generatedDescription ?? '')

        // 3. UPLOAD RACE NAME, DESCRIPTION, IMAGE TO MONGODB
        await saveUserPlayerClass.mutateAsync({
            name: playerClassState.name,
            description: generatedDescription ?? '',
            image: image,
            creatorAddress: user?.walletAddress ?? '',
            nameCombinations: playerClassState.nameCombinations
        });
        playerClassActions.setImageOptions([])

        setCopyClassList([...copyClassList,
            {
              img: image,
              description: generatedDescription ?? '',
              name: playerClassState.name
            }
        ])
        setActiveClass(copyClassList.length)
        playerClassActions.setFetched(true);
    }

    useEffect(() => {
        if (playerClassState.fetched) {
            const newPlayerClasses: ClassProps[] = [];
            otherPlayerClassesState.classes.forEach((playerClass) => {
                newPlayerClasses.push({
                name: playerClass.name,
                img: playerClass.image,
                description: playerClass.description
                });
            });
          setCopyClassList([...copyClassList, ...newPlayerClasses,
            {
              img: playerClassState.imageChoice,
              description: playerClassState.description,
              name: playerClassState.name
            }
        ]);

        }
    }, [playerClassState.fetched]);

    useEffect(() => {
        if(user && !playerClassState.fetched) {
            getPlayerClass()
        }
    }, [user])

    const getPlayerClass = async () => {
        const currentClass = await getUserClass.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })
        if(currentClass) {
            playerClassActions.setDescription(currentClass.description)
            playerClassActions.setName(currentClass.name)
            playerClassActions.setImageChoice(currentClass.image)
            playerClassActions.setFetched(true)
        }
    }

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