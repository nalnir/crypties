import { PText } from "@/shared/components/p_text";
import { useEffect, useState } from "react";
import { RaceCreatorComponent } from "./components/race_creator_component";
import { playerFantasyRaceAtom } from "@/recoil-state/player_fantasy_race/player_fantasy_race.atom";
import { useRecoilValue } from "recoil";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { usePlayerFantasyRaceActions } from "@/recoil-state/player_fantasy_race/player_fantasy_race.actions";
import Image from 'next/image';
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { RaceDocument } from "@/pages/api/schemas/race_schema";
import { useOnboardingHeroActions } from "@/recoil-state/onboarding_hero/onboarding_hero.actions";
import { otherPlayersRacesAtom } from "@/recoil-state/other_players_races/other_players_races.atom";
import { useOtherPlayersRacesActions } from "@/recoil-state/other_players_races/other_players_races.actions";
import { onboardingHeroAtom } from "@/recoil-state/onboarding_hero/onboarding_hero.atom";
import { Input } from "@mui/material";
import { defaultRacesAtom } from "@/recoil-state/default_races/default_races.atom";
import { useDefaultRacesActions } from "@/recoil-state/default_races/default_races.actions";
import { RaceListComponent } from "./components/race_list";

export const Step1 = () => {
    const globalModal = useGlobalModalActions();
    const otherPlayersRacesState = useRecoilValue(otherPlayersRacesAtom)
    const otherPlayersRacesActions = useOtherPlayersRacesActions();
    const playerFantasyRaceState = useRecoilValue(playerFantasyRaceAtom)
    const playerFantasyRaceActions = usePlayerFantasyRaceActions();
    const onboardingHeroActions = useOnboardingHeroActions();
    const onboardingHeroState = useRecoilValue(onboardingHeroAtom);
    const defaultRacesActions = useDefaultRacesActions();
    const defaultRacesState = useRecoilValue(defaultRacesAtom)

    const [activeRace, setActiveRace] = useState<RaceDocument | undefined>()

    const getDefaultFantasyRaces = trpc.getDefaultFantasyRaces.useMutation()
    const generateDescription = trpc.generateDescription.useMutation()
    const saveUserFantasyRace = trpc.saveUserFantasyRace.useMutation()
    const getUserFantasyRace = trpc.getUserFantasyRace.useMutation()

    const [fantasyRaceList, setFantasyRaceList] = useState<RaceDocument[]>([]);

    // const generateImages = trpc.generateImages.useMutation();
    // const getCurrentGeneration = trpc.getCurrentGeneration.useQuery();
    // const uploadMetadataToIPFS = trpc.uploadMetadataToIPFS.useMutation();
    // const uploadMetadataToS3 = trpc.uploadMetadataToS3.useMutation();

    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    // const getUserCards = trpc.getUserCards.useQuery({ walletAddress: user?.walletAddress ?? '' });

    const getAllDefaultRaces = async () => {
        if (!defaultRacesState.fetched) {
            console.log('getAllDefaultRaces -> ()')
            const allDefaultRaces = await getDefaultFantasyRaces.mutateAsync()
            console.log('allDefaultRaces: ', allDefaultRaces)
            defaultRacesActions.setRaces(allDefaultRaces as any)
            if (!playerFantasyRaceState.race && allDefaultRaces) {
                setActiveRace(allDefaultRaces[0] as any)
            }
        }
    }

    console.log('user: ', user)

    useEffect(() => {
        getAllDefaultRaces()
    }, [])

    useEffect(() => {
        if (onboardingHeroState.fantasyRace.id.length > 0) {
            const allRaces: RaceDocument[] = [...defaultRacesState.races as any, ...otherPlayersRacesState.races as any, playerFantasyRaceState.race as any]
            const chosenRace = allRaces.find((race) => race._id === onboardingHeroState.fantasyRace.id)
            console.log('chosenRace: ', chosenRace)
            if (chosenRace) {
                setActiveRace(chosenRace)
            }
        }
    }, [onboardingHeroState.fantasyRace])

    const handlePlayerChoice = async (image: string) => {
        playerFantasyRaceActions.setImageChoice(image)
        globalModal.closeGlobalModal()
        const generatedDescription = await generateDescription.mutateAsync({
            prompt: `Describe ${playerFantasyRaceState.name} in fantasy style. LESS then 40 words.`
        })

        // 3. UPLOAD RACE NAME, DESCRIPTION, IMAGE TO MONGODB
        const playerFantasyRace = await saveUserFantasyRace.mutateAsync({
            name: playerFantasyRaceState.name,
            description: generatedDescription ?? '',
            image: image,
            creatorAddress: user?.walletAddress ?? '',
            nameCombinations: playerFantasyRaceState.nameCombinations,
            default: false
        });
        playerFantasyRaceActions.setImageOptions([])

        playerFantasyRaceActions.setRace(playerFantasyRace as any)
        setActiveRace(playerFantasyRace as any)
        playerFantasyRaceActions.setFetched(true);
    }

    useEffect(() => {
        if (user && !playerFantasyRaceState.fetched) {
            getPlayerFantasyRace()
        }
    }, [user, fantasyRaceList])

    useEffect(() => {
        if (playerFantasyRaceState.imageOptions.length > 0) {
            globalModal.openGlobalModal(<div className="grid grid-cols-2 gap-3">
                {playerFantasyRaceState.imageOptions.map((image, index) => <img className="cursor-pointer" onClick={() =>
                    handlePlayerChoice(image)
                } alt="Player fantasy race option" key={index} src={image} width={1024} height={1024} />)}
            </div>)
        }
    }, [playerFantasyRaceState.imageOptions])

    const getPlayerFantasyRace = async () => {
        const currentRace = await getUserFantasyRace.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })
        if (currentRace) {
            playerFantasyRaceActions.setRace(currentRace as any)
            playerFantasyRaceActions.setFetched(true)
        }
    }

    // const getCards = async () => {
    //     const cards = await getUserCards.mutateAsync({
    //         walletAddress: user?.walletAddress ?? ''
    //     });
    //     const playerCardCollection: OriginalCard[] = []
    //     cards.result.forEach((card) => {
    //         if (card) {
    //             playerCardCollection.push({
    //                 name: card.name ?? '',
    //                 description: card.description ?? '',
    //                 image_url: card.image_url ?? '',
    //                 metadata: card.metadata as any,
    //             })
    //         }
    //     })
    //     console.log('CARDS: ', cards)
    // }

    // THIS FUNCTION SHOULD BE FOR CARD CREATION
    // const generate = async () => {
    //     const GENERATION = process.env.NEXT_PUBLIC_GENERATION;
    //     const images = await generateImages.mutateAsync({
    //         prompt: "PIXAR ANIMATION STYLE, grinning cute gnome"
    //     })

    //     if (images) {
    //         const numberOfTokensToMint = 1;
    //         const generation: any = await getCurrentGeneration.data

    //         const tokenId: number = getLatestCardId.data + 1;
    //         const groupId: number = uuidv4();
    //         const first_image = images[0]
    //         let card: OriginalCard = {
    //             name: "Gnome",
    //             description: "inputs.description",
    //             image_url: first_image.url ?? '',
    //             metadata: {
    //                 health: 1,
    //                 attackPower: 1,
    //                 creatorPlayerName: "juico911",
    //                 creatorAddress: user?.walletAddress ?? '',
    //                 creatorLoreName: "Crescent Rainbow hunter",
    //                 cardType: "common",
    //                 cardTypeId: "123456",
    //                 generation: generation.generation,
    //                 imageId: first_image.id ?? '',
    //                 groupId: groupId
    //             },
    //         }
    //         const cid = await uploadMetadataToIPFS.mutateAsync(card)
    //         console.log('CID: ', cid)
    //         card.metadata.ipfsCID = cid;

    //         console.log('GONNA UPLOAD TO S3')
    //         await Promise.all(
    //             Array.from({ length: numberOfTokensToMint }, (_, i) => i).map(async (i) => {
    //                 await uploadMetadataToS3.mutateAsync({
    //                     original_card: card,
    //                     tokenId: tokenId + i,
    //                 })
    //             })
    //         )
    //         console.log('GONNA MINT')
    //         await mintTokens.mutateAsync({
    //             walletAddress: user?.walletAddress ?? '',
    //             tokenId: 3,
    //             number_of_tokens_to_mint: 1
    //         })

    //         await bumpTokenId.mutateAsync({
    //             bump: (tokenId + numberOfTokensToMint) - 1,
    //             generation: generation
    //         })
    //     }
    // }

    return <div className="grid w-screen h-screen grid-cols-12 bg-primary-400">
        <div className="flex justify-center col-span-8 overflow-hidden">
            <div className="flex items-center justify-center h-full">
                <img width={512} height={512} className="object-contain max-w-full max-h-full" src={`${activeRace?.image}?v=${activeRace?._id}`} alt={activeRace?.name ?? ''} />
            </div>
        </div>

        <div className="flex flex-col justify-between col-span-4 p-3 bg-primary-500">
            <div className="space-y-5">
                <Input value={onboardingHeroState.playerName} onChange={(e) => onboardingHeroActions.setPlayerName(e.target.value)} placeholder="Player name" />
                <RaceListComponent
                    setActiveRace={(race) => setActiveRace(race)}
                    setFantasyRace={(id: string, name: string) => onboardingHeroActions.setFantasyRace({ id: id, name: name })}
                    playerFantasyRace={playerFantasyRaceState.race}
                    activeRace={activeRace}
                    defaultRaces={defaultRacesState.races}
                    otherPlayersRaces={otherPlayersRacesState.races}
                />
                <RaceCreatorComponent />
            </div>
            <div>
                <PText className='text-xl text-white'>{activeRace?.description ?? ''}</PText>
            </div>
        </div>
    </div>
}