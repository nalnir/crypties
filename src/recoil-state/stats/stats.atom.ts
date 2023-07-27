import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { RaceDocument } from '@/pages/api/schemas/race_schema';
import { atom } from 'recoil';

interface StatsAtom {
    fantasyRacesPlayedBy?: RaceDocument;
    playerClassesPlayedBy?: PlayerClassDocument;
    alignmentPlayedBy: {
        lightAlignmentAmount?: number,
        darknessAlignmentAmount?: number
    };
}

export const InitialStatsState = {
    fantasyRacesPlayedBy: undefined,
    playerClassesPlayedBy: undefined,
    alignmentPlayedBy: {
        lightAlignmentAmount: undefined,
        darknessAlignmentAmount: undefined
    },
}
export const statsAtom = atom<StatsAtom>({
    key: 'statsState', // unique ID (with respect to other atoms/selectors)
    default: InitialStatsState,
});