import { Hero } from "./hero";
import { OriginalCard } from "./original_card";

export interface Opponent {
    hero?: Hero,
    socketId: string,
    walletAddres: string,
    battleDeckAmount: number,
    playableCardsAmount: number,
    cardsOnTheTable: OriginalCard[],
    activeCard?: OriginalCard,
    totalMana: number,
    availableMana: number
}