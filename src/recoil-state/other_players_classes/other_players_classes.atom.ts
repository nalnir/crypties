import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';
import { RaceDocument } from '@/pages/api/schemas/race_schema';

interface OtherPlayersClassesAtom {
    classes: RaceDocument[];
    fetched: boolean;
    doneSet: boolean;
}

export const OtherPlayersClassesState = {
    classes: [],
    fetched: false,
    doneSet: false
}
export const otherPlayersClassesAtom = atom<OtherPlayersClassesAtom>({
    key: 'otherPlayersClassesState', // unique ID (with respect to other atoms/selectors)
    default: OtherPlayersClassesState,
});