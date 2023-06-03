import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';
import { RaceDocument } from '@/pages/api/schemas/race_schema';

interface OtherPlayersRacesAtom {
    races: RaceDocument[];
    fetched: boolean;
    doneSet: boolean;
}

export const OtherPlayersRacesState = {
    races: [],
    fetched: false,
    doneSet: false
}
export const otherPlayersRacesAtom = atom<OtherPlayersRacesAtom>({
    key: 'otherPlayersRacesState', // unique ID (with respect to other atoms/selectors)
    default: OtherPlayersRacesState,
});