import { Hero } from "./hero.ts";
import { OriginalCard } from "./original_card.ts";

export enum LingerEffectOperation {
    ADD = "ADD",
    SUBTRACT = "SUBTRACT",
    MULTIPLY = "MULTIPLY",
    DIVIDE = "DIVIDE",
    FREEZE = "FREEZE",
    UNBLOCKABLE = "UNBLOCKABLE"
}
export enum LingerEffectOpTarget {
    MANA = "MANA",
    HEALTH = "HEALTH",
    POWER = "POWER"
}
export interface LingerEffect {
    turns: number,
    target: OriginalCard[],
    effects: {
        operation: LingerEffectOperation,
        opTarget: LingerEffectOpTarget,
        strength: number
    }[],
    shouldRestoreToPreviousState: boolean,
}
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
    lingerEffect: LingerEffect[]
}