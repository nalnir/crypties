import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { useOtherPlayersClassesActions } from "@/recoil-state/other_players_classes/other_players_classes.actions";
import { otherPlayersClassesAtom } from "@/recoil-state/other_players_classes/other_players_classes.atom";
import { usePlayerClassActions } from "@/recoil-state/player_class/player_class.actions";
import { PText } from "@/shared/components/p_text"
import { Button, CircularProgress, Input } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { trpc } from "@/utils/trpc";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { removeSingleWhiteSpace } from "@/utils/functions/remove_single_white_space";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { isSingleWord } from "@/utils/functions/is_single_word";
import { stringCombinations } from "@/utils/functions/string_combinations";

export const ClassCreatorComponent = () => {
    const errorSuccessActions = useErrorSuccessActions();
    const playerFantasyClassActions = usePlayerClassActions();
    const otherPlayersClassesActions = useOtherPlayersClassesActions();
    const otherPlayersClassesState = useRecoilValue(otherPlayersClassesAtom);

    const getOtherPlayerClasses = trpc.getOtherPlayerClasses.useMutation()
    const checkIfPlayerClassAlreadyCreated = trpc.checkIfPlayerClassAlreadyCreated.useMutation()
    const checkIfRaceAlreadyCreated = trpc.checkIfRaceAlreadyCreated.useMutation()
    const correctName = trpc.correctName.useMutation()
    const checkIfPlayerClassExists = trpc.checkIfPlayerClassExists.useMutation()
    const resetCreateTries = trpc.resetCreateTries.useMutation();
    const setCreateCycle = trpc.setCreateCycle.useMutation();
    const isPlayerClass = trpc.isPlayerClass.useMutation();
    const bumpCreateTry = trpc.bumpCreateTry.useMutation();
    const setUseCreatePower = trpc.setUseCreatePower.useMutation();
    const generateFantasyPlayerClassImages = trpc.generateFantasyPlayerClassImages.useMutation();
    
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingFetchOtherPlayerClasses, setLoadingFetchOtherPlayerClasses] = useState(false)

    const queryClient = useQueryClient();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const handleSetName = (e: any) => {
        const input: string = e.target.value
        if(input.length > 15) {
            return
        } 
        setName(input)
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

                const resPlayerClassAlreadyCreated = await checkIfPlayerClassAlreadyCreated.mutateAsync({
                    creatorAddress: user?.walletAddress
                })
                if(resPlayerClassAlreadyCreated) {
                    return handleError('This user already created a class')
                }

                const resRaceAlreadyCreated = await checkIfRaceAlreadyCreated.mutateAsync({
                    creatorAddress: user?.walletAddress
                })
                if(resRaceAlreadyCreated) {
                    return handleError('This user already used his creation power.')
                }

                const resCorrectName = await correctName.mutateAsync({
                    name: adjustedName
                })

                let correctedName = resCorrectName;
                if(!correctedName) {
                    return handleError('Correct player class name failed!')
                }
                correctedName = correctedName.trim()
                

                console.log('checkIfPlayerClassExists => ()')
                const resPlayerClassExists = await checkIfPlayerClassExists.mutateAsync({
                    name: correctedName
                })
                if(resPlayerClassExists) {
                    return handleError('Player class already exists')
                }

                let nameCombinations = []
                if(isSingleWord(correctedName)) {
                    nameCombinations.push(correctedName)
                } else {
                    nameCombinations = stringCombinations(correctedName)
                }

                // CHECK IF USER CAN GENERATE
                if(user?.createTries) {
                    if(user?.createTries > 2) {
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
                const resIsFantayRace = await isPlayerClass.mutateAsync({
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

                        console.log('generateImages => ()')
                        const images = await generateFantasyPlayerClassImages.mutateAsync({
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
                        playerFantasyClassActions.setImageOptions(urls)
                        playerFantasyClassActions.setName(correctedName)
                        playerFantasyClassActions.setNameCombinations(nameCombinations)
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

    const handleGetOtherPlayerClasses = async () => {
        const playerClasses = await getOtherPlayerClasses.mutateAsync({
            walletAddress: user?.walletAddress ?? '',
            page: 0
        })
        if(playerClasses) {
            otherPlayersClassesActions.setClasses(playerClasses)
        }
    }
    
    return <div className="space-y-3">
    { !otherPlayersClassesState.fetched ? 
     <div className="flex items-center space-x-3">
         <PText>See classes created by other players</PText>
         <Button disabled={loadingFetchOtherPlayerClasses} startIcon={loadingFetchOtherPlayerClasses ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleGetOtherPlayerClasses}>Get</Button>
     </div> : <></>
     }
     { user?.hasCreatePower ? 
         <div>
             <PText>Or create your own class</PText>
             <div className="flex items-start space-x-3">
                 <div className="space-y-1">
                     <Input value={name} onChange={handleSetName} placeholder="Name your race"/>
                 <PText>{user?.createTries ? 3 - user?.createTries : 3} tries remain</PText>
                 </div>
                 <Button disabled={loading} startIcon={loading ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleCreate}>Create</Button>
             </div>
         </div> : <></>
     }
 </div>
}