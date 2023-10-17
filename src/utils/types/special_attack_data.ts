import { Hero } from "./hero.ts";
import { OriginalCard } from "./original_card.ts";

export interface SpecialAttackData {
    attackingCard: OriginalCard
    attackerCardsOnBoard: OriginalCard[]
    attackerCardInHand: OriginalCard[]
    attackerDeck: OriginalCard[]
    attackerDiscardedCards: OriginalCard[]
    attackerHero: Hero

    attackedCard: OriginalCard
    opponentCardsOnBoard: OriginalCard[]
    opponentCardInHand: OriginalCard[]
    opponentDeck: OriginalCard[]
    opponentDiscardedCards: OriginalCard[]
    opponentHero: Hero
}