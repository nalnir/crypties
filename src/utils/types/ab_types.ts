export enum EffectType {
    ON_CARD_PLACEMENT = "ON_CARD_PLACEMENT",
    AFTER_BASIC_ATTACK = "AFTER_BASIC_ATTACK",
    AFTER_OPPONENT_BASIC_ATTACK = "AFTER_OPPONENT_BASIC_ATTACK",
    AFTER_END_TURN = "AFTER_END_TURN",
    AFTER_OPPONENT_END_TURN = "AFTER_OPPONENT_END_TURN"
}
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

export interface Hero {
    health: number
}