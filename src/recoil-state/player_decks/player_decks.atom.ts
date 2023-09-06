import { atom } from 'recoil';
import { OriginalCard } from '@/utils/types/original_card';
import { DeckDocument } from "@/pages/api/schemas/deck_schema";

interface PlayerDecksAtom {
    playerDecks: Array<DeckDocument>;
    battleDeck: Array<any>;
    fetched: boolean;
}

export const InitialPlayerDecksState = {
    playerDecks: [],
    battleDeck: [],
    fetched: false
}
export const playerDecksAtom = atom<PlayerDecksAtom>({
    key: 'playerDecksState', // unique ID (with respect to other atoms/selectors)
    default: InitialPlayerDecksState,
});