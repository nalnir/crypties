import { atom } from 'recoil';
import { PlayerClassDocument } from '@/pages/api/schemas/class_schema';
import { UserDocument } from '@/pages/api/schemas/user_schema';
import { Opponent, OriginalCard } from '@/utils';
import { Hero } from '@/utils/types/hero';

interface BattleAtom {
    playerCardsOnTable: OriginalCard[];
    playerPlayableCards: OriginalCard[];
    activeBattleDeck: OriginalCard[];
    myTurn: boolean;
    opponent?: Opponent;
    mySocketId?: string;
    activeCard?: OriginalCard;
    totalMana: number;
    availableMana: number;
    havePlacedOnBoard: boolean;
    haveAttacked: boolean;
    cardsHaveAttacked: string[];
    hero?: Hero;
}

export const InitialBattleState = {
    playerCardsOnTable: [],
    playerPlayableCards: [],
    activeBattleDeck: [],
    myTurn: false,
    opponent: undefined,
    mySocketId: undefined,
    activeCard: undefined,
    totalMana: 0,
    availableMana: 0,
    havePlacedOnBoard: false,
    haveAttacked: false,
    cardsHaveAttacked: [],
    hero: undefined
}
export const battleAtom = atom<BattleAtom>({
    key: 'battleState', // unique ID (with respect to other atoms/selectors)
    default: InitialBattleState,
});