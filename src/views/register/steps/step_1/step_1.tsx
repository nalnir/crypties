import { RaceProps, racesList } from "@/utils/data/races";
import { PText } from "@/shared/components/p_text";
import { useEffect, useState } from "react";
import { RaceCreatorComponent } from "./components/race_creator_component";
import { playerFantasyRaceAtom } from "@/recoil-state/player_fantasy_race/player_fantasy_race.atom";
import { useRecoilValue } from "recoil";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { usePlayerFantasyRaceActions } from "@/recoil-state/player_fantasy_race/player_fantasy_race.actions";
import Image from 'next/image';
import { trpc } from "@/utils/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { RaceDocument } from "@/pages/api/schemas/race_schema";
import useStateCallback from "@/utils/hooks/use_state_callback";
import { useOnboardingHeroActions } from "@/recoil-state/onboarding_hero/onboarding_hero.actions";
import { otherPlayersRacesAtom } from "@/recoil-state/other_players_races/other_players_races.atom";
import { useOtherPlayersRacesActions } from "@/recoil-state/other_players_races/other_players_races.actions";
import { onboardingHeroAtom } from "@/recoil-state/onboarding_hero/onboarding_hero.atom";
import { Input } from "@mui/material";

export const Step1 = () => {
    const globalModal = useGlobalModalActions();
    const otherPlayersRacesState = useRecoilValue(otherPlayersRacesAtom)
    const otherPlayersRacesActions = useOtherPlayersRacesActions();
    const playerFantasyRaceState = useRecoilValue(playerFantasyRaceAtom)
    const playerFantasyRaceActions = usePlayerFantasyRaceActions();
    const onboardingHeroActions = useOnboardingHeroActions();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);
    
    const queryClient = useQueryClient();

    const [activeRace, setActiveRace] = useState(0)
    const [playerName, setPlayerName] = useState('');
    const [copyRaceList, setCopyRaceList] = useState<RaceProps[]>(JSON.parse(JSON.stringify(racesList)));

    const generateDescription = trpc.generateDescription.useMutation()
    const saveUserFantasyRace = trpc.saveUserFantasyRace.useMutation()
    const getUserFantasyRace = trpc.getUserFantasyRace.useMutation()

    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    useEffect(() => {
        const existingHeroFantasyRaceIndex = copyRaceList.findIndex((heroFantasyRace: RaceProps) => heroFantasyRace.name === onboardingHeroState.fantasyRace.name)
        if(existingHeroFantasyRaceIndex > -1) {
            setActiveRace(existingHeroFantasyRaceIndex)
        }
    },[onboardingHeroState.class])

    useEffect(() => {
        if(otherPlayersRacesState.races.length > 0) {
            const newRaces: RaceProps[] = []
            otherPlayersRacesState.races.forEach((race) => {
                newRaces.push({
                    _id: race._id,
                    name: race.name,
                    img: race.image,
                    description: race.description
                })
            })
            setCopyRaceList([...copyRaceList, ...newRaces])
        }
    },[otherPlayersRacesState])

    const handlePlayerChoice = async (image: string) => {
        playerFantasyRaceActions.setImageChoice(image)
        globalModal.closeGlobalModal()
        const generatedDescription = await generateDescription.mutateAsync({
            prompt: `Describe ${playerFantasyRaceState.name} in epic fantasy. Less then 40 words.`
        })
        playerFantasyRaceActions.setDescription(generatedDescription ?? '')

        // 3. UPLOAD RACE NAME, DESCRIPTION, IMAGE TO MONGODB
        await saveUserFantasyRace.mutateAsync({
            name: playerFantasyRaceState.name,
            description: generatedDescription ?? '',
            image: image,
            creatorAddress: user?.walletAddress ?? '',
            nameCombinations: playerFantasyRaceState.nameCombinations
        });
        playerFantasyRaceActions.setImageOptions([])

        setCopyRaceList([...copyRaceList,
            {
                _id: playerFantasyRaceState._id,
                img: image,
                description: generatedDescription ?? '',
                name: playerFantasyRaceState.name
            }
        ])
        setActiveRace(copyRaceList.length)
        playerFantasyRaceActions.setFetched(true);
    }

    useEffect(() => {
        if(user && !playerFantasyRaceState.fetched) {
            getPlayerFantasyRace()
        }
    }, [user])

    useEffect(() => {
        if(playerFantasyRaceState.imageOptions.length > 0) {
            globalModal.openGlobalModal(<div className="grid grid-cols-2 gap-3">
                {playerFantasyRaceState.imageOptions.map((image, index) => <Image className="cursor-pointer" onClick={() => 
                    handlePlayerChoice(image)
                } alt="Player fantasy race option" key={index} src={image} width={1024} height={1024}/>)}
            </div>)
        }
    },[playerFantasyRaceState.imageOptions])

    useEffect(() => {
        if (playerFantasyRaceState.fetched) {
            const newRaces: RaceProps[] = [];
            otherPlayersRacesState.races.forEach((race) => {
                newRaces.push({
                    _id: race._id,
                    name: race.name,
                    img: race.image,
                    description: race.description
                });
            });
          setCopyRaceList([...copyRaceList, ...newRaces,
            {
                _id: playerFantasyRaceState._id,
                img: playerFantasyRaceState.imageChoice,
                description: playerFantasyRaceState.description,
                name: playerFantasyRaceState.name
            }
        ]);

        }
    }, [playerFantasyRaceState.fetched]);



    const getPlayerFantasyRace = async () => {
        const currentRace = await getUserFantasyRace.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })
        if(currentRace) {
            playerFantasyRaceActions.setDescription(currentRace.description)
            playerFantasyRaceActions.setName(currentRace.name)
            playerFantasyRaceActions.setImageChoice(currentRace.image)
            playerFantasyRaceActions.setFetched(true)
            playerFantasyRaceActions.setID(currentRace._id)
        }
    }

    return <div className="grid w-screen h-screen grid-cols-12 bg-primary-400">
        <div className="flex justify-center col-span-8 overflow-hidden">
            <div className="flex items-center justify-center h-full">
                <Image key={activeRace} width={512} height={512} className="object-contain max-w-full max-h-full" src={`${copyRaceList[activeRace].img}?v=${activeRace}`} alt={copyRaceList[activeRace].name} />
            </div>
        </div>

        <div className="flex flex-col justify-between col-span-4 p-3 bg-primary-500">
            <div className="space-y-5">
                <Input value={onboardingHeroState.playerName} onChange={(e) => onboardingHeroActions.setPlayerName(e.target.value)} placeholder="Player name"/>
                <div className="space-y-3">
                    {copyRaceList.map((race, index) => <div key={index} className="cursor-pointer" onClick={() => {
                        console.log('race: ', race)
                        onboardingHeroActions.setFantasyRace({
                            id: race._id,
                            name: race.name
                        })
                        setActiveRace(index)
                    }}>
                        <PText className={`text-xl ${activeRace === index ? 'text-secondary-400' : 'text-white'}`}>{race.name}</PText>
                    </div>
                    )}
                </div>
                <RaceCreatorComponent />
            </div>
            <div>
                <PText className='text-xl text-white'>{copyRaceList[activeRace].description}</PText>
            </div>
        </div>
    </div>
}