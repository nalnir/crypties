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
import { useProgressiveLoaderActions } from "@/recoil-state/progressive_loader/progressive_loader.actions";

export const ClassCreatorComponent = () => {
    const errorSuccessActions = useErrorSuccessActions();
    const progressiveLoaderActions = useProgressiveLoaderActions();
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
    const generateFantasyPlayerClassImages = trpc.generateImages.useMutation();
    
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
        progressiveLoaderActions.closeProgressiveLoader();
        setLoading(false);
    }

    const handleCreate = async () => {
        try {
            if(user?.walletAddress) {
                const adjustedName = capitalizeFirstLetter(removeSingleWhiteSpace(name.toLowerCase()))
                setLoading(true)

                progressiveLoaderActions.openProgressiveLoader(10, { position: 1, description: 'Checking if player used the creation power'  })
                const resPlayerClassAlreadyCreated = await checkIfPlayerClassAlreadyCreated.mutateAsync({
                    creatorAddress: user?.walletAddress
                })
                if(resPlayerClassAlreadyCreated) {
                    return handleError('This user already created a class')
                }

                progressiveLoaderActions.setActiveStep({ position: 2, description: 'Checking if player used the creation power'  })
                const resRaceAlreadyCreated = await checkIfRaceAlreadyCreated.mutateAsync({
                    creatorAddress: user?.walletAddress
                })
                if(resRaceAlreadyCreated) {
                    return handleError('This user already used his creation power.')
                }

                progressiveLoaderActions.setActiveStep({ position: 3, description: 'Correcting the name for the class'  })
                const resCorrectName = await correctName.mutateAsync({
                    name: adjustedName
                })

                let correctedName = resCorrectName;
                if(!correctedName) {
                    return handleError('Correct player class name failed!')
                }
                correctedName = correctedName.trim()
                
                progressiveLoaderActions.setActiveStep({ position: 4, description: 'Checking if class exists'  })
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
                if(user?.createTriesUsed) {
                    if(user?.createTriesUsed > 2) {
                        if(user.createNextCycle) {
                            
                            const currentDate = new Date();
                            if(new Date(user.createNextCycle) < currentDate) {
                                progressiveLoaderActions.setActiveStep({ position: 5, description: 'Reseting creation power'  })
                                const updatedUser = await resetCreateTries.mutateAsync({ walletAddress: user.walletAddress})
                                queryClient.setQueryData(['user'], updatedUser);
                            } else {
                                const timeDifference = new Date(user.createNextCycle).getTime() - currentDate.getTime();
                                const minutesRemaining = Math.floor(timeDifference / (1000 * 60));
                                return handleError(`Please wait for ${minutesRemaining} minutes to try again`)
                            }
                        } else {
                            progressiveLoaderActions.setActiveStep({ position: 6, description: 'Setting creation cycle'  })
                            const updatedUser = await setCreateCycle.mutateAsync({ walletAddress: user.walletAddress})
                            queryClient.setQueryData(['user'], updatedUser);
                            return handleError('Please wait for 1 hour to try again')

                        }
                    }
                }

                // CHECK IF CLASS IS FANTASY CLASS
                progressiveLoaderActions.setActiveStep({ position: 7, description: 'Checking if fantasy class is relevant'  })
                const resIsPlayerClass = await isPlayerClass.mutateAsync({
                    name: correctedName
                })
                if(!resIsPlayerClass) {
                    return handleError('Somethign went worng with the ChatGPT check')
                } else {
                    if(resIsPlayerClass.toLowerCase().includes('false')) {
                        progressiveLoaderActions.setActiveStep({ position: 8, description: 'Bumping creation power tries'  })
                        const updatedUser = await bumpCreateTry.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        queryClient.setQueryData(['user'], updatedUser);
                        return handleError('The name does not sound like a fantasy race.')
                    } else {

                        progressiveLoaderActions.setActiveStep({ position: 9, description: 'Generating images'  })
                        const images = await generateFantasyPlayerClassImages.mutateAsync({
                            prompt: `${correctedName} logo face, epic fantasy, perfectly centered image, image in the center, flawless center shot, colourful, highly detailed, vibrant color, high detail, epic background`,
                            negative_prompt: 'watermark, signature, cropped, zoomed, abnormal, bizzare, double heads, lowpoly, distortion, blur, flat, matte, dead, loud, tension. Extra Arms, extra limbs, long neck,teeth, long head',
                            modelId: 'b820ea11-02bf-4652-97ae-9ac0cc00593d',
                            num_images: 2
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
                        progressiveLoaderActions.setActiveStep({ position: 10, description: 'Bumping creation power tries'  })
                        await bumpCreateTry.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        const updatedUser = setUseCreatePower.mutateAsync({
                            walletAddress: user.walletAddress
                        })
                        queryClient.setQueryData(['user'], updatedUser);
                        progressiveLoaderActions.closeProgressiveLoader();
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
                 <PText>{user?.createTriesUsed ? 3 - user?.createTriesUsed : 3} tries remain</PText>
                 </div>
                 <Button disabled={loading} startIcon={loading ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleCreate}>Create</Button>
             </div>
         </div> : <></>
     }
 </div>
}