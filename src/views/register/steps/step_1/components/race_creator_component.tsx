import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions"
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { trpc } from "@/utils/trpc";
import { Button, CircularProgress, Input } from "@mui/material"
import { useState } from "react"
import { useAccount } from "wagmi";

export const RaceCreatorComponent = () => {
    const errorSuccessActions = useErrorSuccessActions();
    const checkIfAlreadyCreated = trpc.checkIfAlreadyCreated.useMutation()
    const checkIfRaceExists = trpc.checkIfRaceExists.useMutation()
    const userHasTries = trpc.userHasTries.useMutation()
    const createRace = trpc.createRace.useMutation()
    const testDiscord = trpc.generateImages.useMutation()
    const isFantayRace = trpc.isFantasyRace.useMutation();
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const { address, isConnected } = useAccount()

    function downloadBufferAsImage(bufferData: number[], filename: string): void {
        const buffer = Buffer.from(bufferData);
        const blob = new Blob([buffer], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute("download", "image.png")
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        // URL.revokeObjectURL(url);
    }

    const handleSetName = (e: any) => {
        const input: string = e.target.value
        if(input.length > 15) {
            return
        } 
        setName(input)
    }

    const handleCreateImages = async () => {
        const resRaceExists = await testDiscord.mutateAsync({
            text: name
        })


        // const isFantasyName = await isFantayRace.mutateAsync({
        //     name: name
        // })

        // console.log('isFantasyName: ', isFantasyName)
        // console.log('resRaceExists: ', resRaceExists)
        // if(resRaceExists) {
        //     downloadBufferAsImage(resRaceExists.data, 'test');
        // }
    }

    const handleCreate = async () => {
        try {
            if(address) {
                setLoading(true)
                const resAlreadyCreated = await checkIfAlreadyCreated.mutateAsync({
                    creatorAddress: address
                })
                if(resAlreadyCreated) {
                    errorSuccessActions.openErrorSuccess('This user already created a race', ErrorSuccessType.ERROR)
                    setLoading(false);
                    return
                }

                const resRaceExists = await checkIfRaceExists.mutateAsync({
                    name: name
                })
                if(resRaceExists) {
                    errorSuccessActions.openErrorSuccess('Race already exists', ErrorSuccessType.ERROR)
                    setLoading(false);
                    return
                }

                // CHECK IF RACE IS FANTASY NAME
                const resIsFantayRace = await isFantayRace.mutateAsync({
                    name: name
                })
                if(!resIsFantayRace) {
                    errorSuccessActions.openErrorSuccess('Race already exists', ErrorSuccessType.ERROR)
                    setLoading(false);
                    return
                } else {
                    if(resIsFantayRace.toLowerCase().includes('false')) {
                        // IF RACE IS NOT A FANTASY NAME BUMP THE MAX USAGE FOR THE USER (MAX 5 tries). THEN USER HAS TO WAIT FOR 1 HOUR TO RETRY
                        
                    }
                

                // IF RACE IS FANTASY NAME SAVE IT TO THE COLLECTION

                // IF RACE IS NOT A FANTASY NAME BUMP THE MAX USAGE FOR THE USER (MAX 5 tries). THEN USER HAS TO WAIT FOR 1 HOUR TO RETRY

                // CREATE IMAGE

                // UPLOAD IMAGE TO IPFS & GET URL

                // CREATE DESCRIPTION

                // UPLOAD RACE NAME, DESCRIPTION, IMAGE TO MONGODB
                }
                
                setLoading(false);
            }
          } catch (error) {
            setLoading(false);
          }
    }
    return <div className="flex items-center space-x-3">
        <Input value={name} onChange={handleSetName} placeholder="Name your race"/>
        <Button disabled={loading} startIcon={loading ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleCreate}>Create</Button>
        <Button onClick={handleCreateImages}>TEST DISCORD BOT</Button>
    </div>
}