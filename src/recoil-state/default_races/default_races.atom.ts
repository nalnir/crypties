import { atom } from 'recoil';
import { Vector3 } from '@react-three/fiber';
import { PlayingCardModel } from '@/utils/mocks/player_deck';
import { RaceDocument } from '@/pages/api/schemas/race_schema';

interface DefaultRacesAtom {
    races: RaceDocument[];
    fetched: boolean;
    doneSet: boolean;
}

export const DefaultRacesState = {
    races: [],
    fetched: false,
    doneSet: false
}
export const defaultRacesAtom = atom<DefaultRacesAtom>({
    key: 'defaultRacesState', // unique ID (with respect to other atoms/selectors)
    default: DefaultRacesState,
});