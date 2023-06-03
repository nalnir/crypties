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

    const checkIfAlreadyCreated = trpc.checkIfAlreadyCreated.useMutation()
    const checkIfRaceExists = trpc.checkIfRaceExists.useMutation()
    const generateImages = trpc.generateImages.useMutation()
    const isFantayRace = trpc.isFantasyRace.useMutation();
    const bumpCreateFantasyRaceTry = trpc.bumpCreateFantasyRaceTry.useMutation()
    const setCreateFantasyRaceCycle = trpc.setCreateFantasyRaceCycle.useMutation()
    const resetCreateFantasyRaceTries = trpc.resetCreateFantasyRaceTries.useMutation()
    const correctedFantasyRace = trpc.correctedFantasyRace.useMutation()
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
            otherPlayersRacesActions.setRaces(races)
        }
    }

    const handleCreate = async () => {
        try {
            if(user?.walletAddress) {
                const adjustedName = capitalizeFirstLetter(removeSingleWhiteSpace(name.toLowerCase()))
                setLoading(true)
                // const resAlreadyCreated = await checkIfAlreadyCreated.mutateAsync({
                //     creatorAddress: user?.walletAddress
                // })
                // if(resAlreadyCreated) {
                //     errorSuccessActions.openErrorSuccess('This user already created a race', ErrorSuccessType.ERROR)
                //     setLoading(false);
                //     return
                // }

                const resCorrectedFantasyRace = await correctedFantasyRace.mutateAsync({
                    name: adjustedName
                })

                let correctedName = resCorrectedFantasyRace;
                if(!correctedName) {
                    errorSuccessActions.openErrorSuccess('Correct fantasy race name failed!', ErrorSuccessType.ERROR)
                    setLoading(false);
                    return
                }
                correctedName = correctedName.trim()
                

                console.log('checkIfRaceExists => ()')
                const resRaceExists = await checkIfRaceExists.mutateAsync({
                    name: correctedName
                })
                if(resRaceExists) {
                    errorSuccessActions.openErrorSuccess('Race already exists', ErrorSuccessType.ERROR)
                    setLoading(false);
                    return
                }

                let nameCombinations = []
                if(isSingleWord(correctedName)) {
                    nameCombinations.push(correctedName)
                } else {
                    nameCombinations = stringCombinations(correctedName)
                }

                // CHECK IF USER CAN GENERATE
                if(user?.createFantasyRaceTries) {
                    if(user?.createFantasyRaceTries > 2) {
                        if(user.createFantasyRaceNextCycle) {
                            
                            const currentDate = new Date();
                            if(new Date(user.createFantasyRaceNextCycle) < currentDate) {
                                console.log('resetCreateFantasyRaceTries => ()')
                                const updatedUser = await resetCreateFantasyRaceTries.mutateAsync({ walletAddress: user.walletAddress})
                                queryClient.setQueryData(['user'], updatedUser);
                            } else {
                                const timeDifference = new Date(user.createFantasyRaceNextCycle).getTime() - currentDate.getTime();
                                const minutesRemaining = Math.floor(timeDifference / (1000 * 60));
                                errorSuccessActions.openErrorSuccess(`Please wait for ${minutesRemaining} minutes to try again`, ErrorSuccessType.ERROR)
                                setLoading(false);
                                return
                            }
                        } else {
                            console.log('setCreateFantasyRaceCycle => ()')
                            const updatedUser = await setCreateFantasyRaceCycle.mutateAsync({ walletAddress: user.walletAddress})
                            queryClient.setQueryData(['user'], updatedUser);
                            errorSuccessActions.openErrorSuccess('Please wait for 1 hour to try again', ErrorSuccessType.ERROR)
                            setLoading(false);
                            return
                        }
                    }
                }

                // CHECK IF RACE IS FANTASY NAME
                console.log('isFantayRace => ()')
                const resIsFantayRace = await isFantayRace.mutateAsync({
                    name: correctedName
                })
                if(!resIsFantayRace) {
                    errorSuccessActions.openErrorSuccess('Somethign went worng with the ChatGPT check', ErrorSuccessType.ERROR)
                    setLoading(false);
                    return
                } else {
                    if(resIsFantayRace.toLowerCase().includes('false')) {
                        console.log('bumpCreateFantasyRaceTry => ()')
                        const updatedUser = await bumpCreateFantasyRaceTry.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        queryClient.setQueryData(['user'], updatedUser);
                        errorSuccessActions.openErrorSuccess('The name does not sound like a fantasy race.')
                        setLoading(false);
                        return
                    } else {

                        console.log('generateImages => ()')
                        const images = await generateImages.mutateAsync({
                            text: correctedName
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
                        console.log('bumpCreateFantasyRaceTry => ()')
                        const updatedUser = await bumpCreateFantasyRaceTry.mutateAsync({
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
        <div>
            <PText>Or create your own</PText>
            <div className="flex items-start space-x-3">
                <div className="space-y-1">
                    <Input value={name} onChange={handleSetName} placeholder="Name your race"/>
                <PText>{user?.createFantasyRaceTries ? 3 - user?.createFantasyRaceTries : 3} tries remain</PText>
                </div>
                <Button disabled={loading} startIcon={loading ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleCreate}>Create</Button>
            </div>
        </div>
    </div>
}