import { useRecoilValue, useSetRecoilState } from "recoil";
import { battleAtom } from "./battle.atom";
import { PlayerClassDocument } from "@/pages/api/schemas/class_schema";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { Opponent, OriginalCard } from "@/utils";
import { Hero } from "@/utils/types/hero";

export function useBattleActions() {
    const setBattle = useSetRecoilState(battleAtom);
    const battleState = useRecoilValue(battleAtom);

    return {
        setPlayerCardsOnTable,
        setPlayerPlayableCards,
        setMyTurn,
        setActiveBattleDeck,
        setOpponent,
        setMySocketId,
        setActiveCard,
        refilManna,
        setHavePlacedOnBoard,
        setAvailableMana,
        setHero,
        setHaveAttacked,
        setCardsHaveAttacked,
        resetCardsHaveAttacked
    };

    function setMySocketId(mySocketId: string) {
        setBattle((state: any) => ({
            ...state,
            mySocketId: mySocketId,
        }))
    }

    function setActiveBattleDeck(deck: any[]) {
        setBattle((state: any) => ({
            ...state,
            activeBattleDeck: [...deck],
        }))
    }

    function setPlayerCardsOnTable(playerCardsOnTable: OriginalCard[]) {
        setBattle((state: any) => ({
            ...state,
            playerCardsOnTable: [...playerCardsOnTable]
        }))
    }

    function setPlayerPlayableCards(playerPlayableCards: OriginalCard[]) {
        setBattle((state: any) => ({
            ...state,
            playerPlayableCards: [...playerPlayableCards]
        }))
    }

    function setMyTurn(turn: boolean) {
        setBattle((state: any) => ({
            ...state,
            myTurn: turn
        }))
    }

    function setOpponent(opponent: Opponent) {
        setBattle((state: any) => ({
            ...state,
            opponent: opponent
        }))
    }

    function setActiveCard(card: OriginalCard | undefined) {
        setBattle((state: any) => ({
            ...state,
            activeCard: card
        }))
    }

    function refilManna() {
        const currentMana = battleState.totalMana
        if (currentMana === 10) {
            setBattle((state: any) => ({
                ...state,
                availableMana: 10,
            }))
            return;
        }
        setBattle((state: any) => ({
            ...state,
            availableMana: currentMana + 1,
            totalMana: currentMana + 1
        }))
    }

    function setHavePlacedOnBoard(havePlaced: boolean) {
        setBattle((state: any) => ({
            ...state,
            havePlacedOnBoard: havePlaced
        }))
    }

    function setAvailableMana(manaLeft: number) {
        setBattle((state: any) => ({
            ...state,
            availableMana: manaLeft
        }))
    }

    function setHero(hero: Hero) {
        setBattle((state: any) => ({
            ...state,
            hero: hero
        }))
    }

    function setHaveAttacked(haveAttacked: boolean) {
        setBattle((state: any) => ({
            ...state,
            haveAttacked: haveAttacked
        }))
    }

    function setCardsHaveAttacked(tokenId: string) {
        setBattle((state: any) => ({
            ...state,
            cardsHaveAttacked: [...battleState.cardsHaveAttacked, tokenId]
        }))
    }

    function resetCardsHaveAttacked() {
        setBattle((state: any) => ({
            ...state,
            cardsHaveAttacked: []
        }))
    }
}