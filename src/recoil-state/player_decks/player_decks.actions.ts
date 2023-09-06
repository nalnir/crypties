import { useRecoilValue, useSetRecoilState } from "recoil";
import { playerDecksAtom } from "./player_decks.atom";
import { DeckDocument } from "@/pages/api/schemas/deck_schema";

export function usePlayerDecksActions() {
    const setPlayerDecks = useSetRecoilState(playerDecksAtom);
    const playerDecksState = useRecoilValue(playerDecksAtom)

    return {
        setAllDecks,
        setAddDeckToList,
        replaceDeckInList,
        removeDeckFromList,
        setBattleDeck,
    };

    function setAllDecks(decks: DeckDocument[]) {
        setPlayerDecks((state: any) => ({
            ...state,
            playerDecks: [...decks],
            fetched: true
        }))
    }

    function setAddDeckToList(deck: DeckDocument) {
        const currentDeckList = JSON.parse(JSON.stringify(playerDecksState.playerDecks));
        currentDeckList.push(deck)
        setPlayerDecks((state: any) => ({
            ...state,
            playerDecks: [...currentDeckList],
        }))
    }

    function replaceDeckInList(deck: any) {
        const currentDeckList: DeckDocument[] = JSON.parse(JSON.stringify(playerDecksState.playerDecks));
        const currentIdx = currentDeckList.findIndex(currentDeck => currentDeck._id === deck._id);
        currentDeckList[currentIdx] = deck;
        setPlayerDecks((state: any) => ({
            ...state,
            playerDecks: [...currentDeckList],
        }))
    }

    function removeDeckFromList(deck: DeckDocument) {
        const currentDeckList: DeckDocument[] = JSON.parse(JSON.stringify(playerDecksState.playerDecks));
        const currentIdx = currentDeckList.findIndex(currentDeck => currentDeck._id === deck._id);
        currentDeckList.splice(currentIdx, 1);
        setPlayerDecks((state: any) => ({
            ...state,
            playerDecks: [...currentDeckList],
        }))
    }

    function setBattleDeck(deck: any[]) {
        setPlayerDecks((state: any) => ({
            ...state,
            battleDeck: [...deck],
        }))
    }
}