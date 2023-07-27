import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useStatsActions } from "@/recoil-state/stats/stats.actions";
import { statsAtom } from "@/recoil-state/stats/stats.atom";
import { PText } from "@/shared";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { trpc } from "@/utils/trpc";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "flowbite-react";
import { useRecoilValue } from "recoil";

function AvatarTab() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const statsActions = useStatsActions();
    const statsState = useRecoilValue(statsAtom);
    const getRaceStat = trpc.getRaceStat.useMutation();
    const getClassStat = trpc.getClassStat.useMutation();
    const getAlignmentStat = trpc.getAlignmentStat.useMutation();


    const fantasyRaceStats = async () => {
        if (!statsState.fantasyRacesPlayedBy) {
            const stat: any = await getRaceStat.mutateAsync({ id: user?.fantasyRace.ref ?? '' })
            statsActions.setFantasyRacesPlayedByAmount(stat)
        }
    }

    const playerClassStats = async () => {
        if (!statsState.playerClassesPlayedBy) {
            const stat: any = await getClassStat.mutateAsync({ id: user?.playerClass.ref ?? '' })
            statsActions.setPlayerClassesPlayedByAmount(stat)
        }
    }
    console.log('getRaceStat.isLoading: ', getRaceStat.isLoading)

    const alignmentStats = async () => {
        if (!statsState.alignmentPlayedBy.darknessAlignmentAmount && !statsState.alignmentPlayedBy.lightAlignmentAmount) {
            const stat: any = await getAlignmentStat.mutateAsync()
            statsActions.setAlignmentByAmount(stat)
        }
    }

    const renderIsLoading = (loading: boolean) => {
        if (loading) {
            return <CircularProgress className="w-2 h-2 text-secondary-400" />
        }
        return <></>
    }

    return <div className="flex-col items-center justify-center space-y-3">
        <div className="flex items-start justify-center space-x-3">
            <PText className="flex space-x-1">{user?.playerName}:
                <Tooltip className="flex bg-black" content={`${user?.fantasyRace.name} is played by ${statsState.fantasyRacesPlayedBy?.playedByAmount ?? 0} ${statsState.fantasyRacesPlayedBy?.playedByAmount === 1 ? 'player' : 'players'}`}>
                    <span onMouseOver={fantasyRaceStats} className="cursor-pointer">{renderIsLoading(getRaceStat.isLoading)} {user?.fantasyRace.name}</span>
                </Tooltip>
                <Tooltip className="flex bg-black" content={`${user?.playerClass.name} is played by ${statsState.playerClassesPlayedBy?.playedByAmount ?? 0} ${statsState.playerClassesPlayedBy?.playedByAmount === 1 ? 'player' : 'players'}`}>
                    <span onMouseOver={playerClassStats} className="cursor-pointer">{renderIsLoading(getClassStat.isLoading)} {user?.playerClass.name}</span>
                </Tooltip>
            </PText>
        </div>
        <div className="flex items-start justify-center">
            <PText>Lore name: {user?.generatedName}</PText>
        </div>
        <div className="flex items-start justify-center">
            <Tooltip className="flex bg-black" content={`${statsState.alignmentPlayedBy.lightAlignmentAmount ?? 0} players align with light.\n${statsState.alignmentPlayedBy.darknessAlignmentAmount ?? 0} players align with darkness.`}>
                <PText>Alignment:
                    <span onMouseOver={alignmentStats} className="cursor-pointer">{renderIsLoading(getAlignmentStat.isLoading)} {capitalizeFirstLetter(user?.alignment ?? '')}</span>
                </PText>
            </Tooltip>
        </div>
        <div className="rounded-full">
            <img className="rounded-full" src={user?.profilePicture} />
        </div>
    </div>
}

export default AvatarTab;