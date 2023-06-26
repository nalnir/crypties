import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions"
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { trpc } from "@/utils/trpc";
import { Button, CircularProgress, Input } from "@mui/material"
import { useState } from "react"
import { useAccount } from "wagmi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { usePlayerFantasyRaceActions } from "@/recoil-state/player_fantasy_race/player_fantasy_race.actions";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { PText } from "@/shared/components/p_text";
import { removeSingleWhiteSpace } from "@/utils/functions/remove_single_white_space";
import { stringCombinations } from "@/utils/functions/string_combinations";
import { isSingleWord } from "@/utils/functions/is_single_word";
import { RaceDocument } from "@/pages/api/schemas/race_schema";
import { useOtherPlayersRacesActions } from "@/recoil-state/other_players_races/other_players_races.actions";
import { useRecoilValue } from "recoil";
import { otherPlayersRacesAtom } from "@/recoil-state/other_players_races/other_players_races.atom";

export const RaceCreatorComponent = () => {
    const errorSuccessActions = useErrorSuccessActions();
    const playerFantasyRaceActions = usePlayerFantasyRaceActions();
    const otherPlayersRacesActions = useOtherPlayersRacesActions();
    const otherPlayersRacesState = useRecoilValue(otherPlayersRacesAtom);

    const checkIfRaceAlreadyCreated = trpc.checkIfRaceAlreadyCreated.useMutation()
    const checkIfPlayerClassAlreadyCreated = trpc.checkIfPlayerClassAlreadyCreated.useMutation()
    const checkIfRaceExists = trpc.checkIfRaceExists.useMutation()
    const generateFantasyRaceImages = trpc.generateImages.useMutation()
    const isFantayRace = trpc.isFantasyRace.useMutation();
    const bumpCreateTry = trpc.bumpCreateTry.useMutation()
    const setUseCreatePower = trpc.setUseCreatePower.useMutation()
    const setCreateCycle = trpc.setCreateCycle.useMutation()
    const resetCreateTries = trpc.resetCreateTries.useMutation()
    const correctName = trpc.correctName.useMutation()
    const getOtherFantasyRaces = trpc.getOtherFantasyRaces.useMutation()

    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingFetchOtherFantasyRaces, setLoadingFetchOtherFantasyRaces] = useState(false)

    const queryClient = useQueryClient();
    const { data: user, isLoading: isLoadingUser, isError: isErrorUser } = useQuery<UserDocument>(['user']);

    const handleSetName = (e: any) => {
        const input: string = e.target.value
        if(input.length > 15) {
            return
        } 
        setName(input)
    }

    const handleGetOtherFantasyRaces = async () => {
        const races = await getOtherFantasyRaces.mutateAsync({
            walletAddress: user?.walletAddress ?? '',
            page: 0
        })
        if(races) {
            console.log('RACES: ', races)
            otherPlayersRacesActions.setRaces(races)
        }
    }

    const handleError = (errorMessage: string) => {
        errorSuccessActions.openErrorSuccess(errorMessage, ErrorSuccessType.ERROR)
        setLoading(false);
    }

    const handleCreate = async () => {
        try {
            if(user?.walletAddress) {
                const adjustedName = capitalizeFirstLetter(removeSingleWhiteSpace(name.toLowerCase()))
                setLoading(true)

                const resRaceAlreadyCreated = await checkIfRaceAlreadyCreated.mutateAsync({
                    creatorAddress: user?.walletAddress
                })
                if(resRaceAlreadyCreated) {
                    return handleError('This user already created a race')
                }

                const resPlayerClassAlreadyCreated = await checkIfPlayerClassAlreadyCreated.mutateAsync({
                    creatorAddress: user?.walletAddress
                })
                if(resPlayerClassAlreadyCreated) {
                    return handleError('This user already used his creation power.')
                }

                const resCorrectName = await correctName.mutateAsync({
                    name: adjustedName
                })

                let correctedName = resCorrectName;
                if(!correctedName) {
                    return handleError('Correct fantasy race name failed!')
                }
                correctedName = correctedName.trim()
                

                console.log('checkIfRaceExists => ()')
                const resRaceExists = await checkIfRaceExists.mutateAsync({
                    name: correctedName
                })
                if(resRaceExists) {
                    return handleError('Race already exists')
                }

                let nameCombinations = []
                if(isSingleWord(correctedName)) {
                    nameCombinations.push(correctedName)
                } else {
                    nameCombinations = stringCombinations(correctedName)
                }

                // CHECK IF USER CAN GENERATE
                if(user?.createTriesUsed) {
                    if(user?.createTriesUsed > 2) {
                        if(user.createNextCycle) {
                            
                            const currentDate = new Date();
                            if(new Date(user.createNextCycle) < currentDate) {
                                console.log('resetCreateTries => ()')
                                const updatedUser = await resetCreateTries.mutateAsync({ walletAddress: user.walletAddress})
                                queryClient.setQueryData(['user'], updatedUser);
                            } else {
                                const timeDifference = new Date(user.createNextCycle).getTime() - currentDate.getTime();
                                const minutesRemaining = Math.floor(timeDifference / (1000 * 60));
                                return handleError(`Please wait for ${minutesRemaining} minutes to try again`)
                            }
                        } else {
                            console.log('setCreateCycle => ()')
                            const updatedUser = await setCreateCycle.mutateAsync({ walletAddress: user.walletAddress})
                            queryClient.setQueryData(['user'], updatedUser);
                            return handleError('Please wait for 1 hour to try again')

                        }
                    }
                }

                // CHECK IF RACE IS FANTASY NAME
                console.log('isFantayRace => ()')
                const resIsFantayRace = await isFantayRace.mutateAsync({
                    name: correctedName
                })
                if(!resIsFantayRace) {
                    return handleError('Somethign went worng with the ChatGPT check')
                } else {
                    if(resIsFantayRace.toLowerCase().includes('false')) {
                        console.log('bumpCreateFantasyRaceTry => ()')
                        const updatedUser = await bumpCreateTry.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        queryClient.setQueryData(['user'], updatedUser);
                        return handleError('The name does not sound like a fantasy race.')
                    } else {

                        console.log('generateFantasyRaceImages => ()')
                        const images = await generateFantasyRaceImages.mutateAsync({
                            prompt: `${correctedName} portrait, fantasy, centered, 4k resolution, bright color, beautiful background, male or female, pixar style`,
                            negative_prompt: 'logo, watermark, signature, cropped, zoomed, abnormal, bizzare, double heads, minimalistic, lowpoly, distortion, blur, flat, matte, dead, loud, tension. Extra Arms, extra limbs, long neck,teeth, long head',
                        })
                        const urls: string[] = []
                        if(images) {
                            images.forEach((image) => {
                                if(image.url) {
                                    urls.push(image.url)
                                }
                            })
                        }
                        playerFantasyRaceActions.setImageOptions(urls)
                        playerFantasyRaceActions.setName(correctedName)
                        playerFantasyRaceActions.setNameCombinations(nameCombinations)
                        console.log('bumpCreateTry => ()')
                        await bumpCreateTry.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        const updatedUser = setUseCreatePower.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        queryClient.setQueryData(['user'], updatedUser);
                        setLoading(false);
                        return
                    }
                }
            }
          } catch (error) {
            setLoading(false);
          }
    }

    return <div className="space-y-3">
       { !otherPlayersRacesState.fetched ? 
        <div className="flex items-center space-x-3">
            <PText>See races created by other players</PText>
            <Button disabled={loadingFetchOtherFantasyRaces} startIcon={loadingFetchOtherFantasyRaces ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleGetOtherFantasyRaces}>Get</Button>
        </div> : <></>
        }
        { user?.hasCreatePower ? 
            <div>
                <PText>Or create your own</PText>
                <div className="flex items-start space-x-3">
                    <div className="space-y-1">
                        <Input value={name} onChange={handleSetName} placeholder="Name your race"/>
                    <PText>{user?.createTriesUsed ? 3 - user?.createTriesUsed : 3} tries remain</PText>
                    </div>
                    <Button disabled={loading} startIcon={loading ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleCreate}>Create</Button>
                </div>
            </div> : <></>
        }
    </div>
}