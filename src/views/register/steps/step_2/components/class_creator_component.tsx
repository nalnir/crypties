import { UserDocument } from "@/pages/api/schemas/user_schema";
import { PText } from "@/shared/components/p_text"
import { Button, CircularProgress, Input } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const ClassCreatorComponent = () => {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const queryClient = useQueryClient();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const handleSetName = (e: any) => {
        const input: string = e.target.value
        if(input.length > 15) {
            return
        } 
        setName(input)
    }

    const handleCreate = async () => {
        try {
            setLoading(true);
            console.log('user: ', user)
        } catch (error) {
            setLoading(false);
        }
    }
    
    return <div className="flex items-start space-x-3">
        <div className="space-y-1">
        <Input value={name} onChange={handleSetName} placeholder="Name your class"/>
        <PText>{user?.createFantasyRaceTries ? 5 - user?.createFantasyRaceTries : 5} tries remain</PText>
        </div>
        <Button disabled={loading} startIcon={loading ? <CircularProgress className="w-5 h-5 text-secondary-400"/> : <></>} onClick={handleCreate}>Create</Button>
    </div>
}