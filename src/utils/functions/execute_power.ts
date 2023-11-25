import { OriginalCard } from "../types";
import { EffectType } from "../types/ab_types";
import { SpecialAttackData } from "../types/special_attack_data";
import powerRegistry from "arcane-blessings";

export function executePower(move: EffectType, data: SpecialAttackData, card: OriginalCard) {
    const specialPower = card.metadata.special;
    if (!specialPower) return;

    const libraryPower = powerRegistry[specialPower];
    console.log('libraryPower: ', libraryPower.takesEffect)
    console.log('move: ', move)
    if (libraryPower.takesEffect !== move) return;

    console.log('equals power move: ', libraryPower.takesEffect === move)

    const usedCardPower: OriginalCard = JSON.parse(JSON.stringify(card))
    if (!card.specialPowerUsed) {
        console.log('NO USED POWER ONCE')
        const res = libraryPower.execute(data);
        usedCardPower.specialPowerUsed = 1;
        const usedCardIdx = res.attackerCardsOnBoard.findIndex((attackerCard) => attackerCard.token_id === card.token_id);
        if (usedCardIdx > -1) {
            res.attackerCardsOnBoard[usedCardIdx] = usedCardPower
        }
        return res
    } else {
        console.log('USED: ', card.specialPowerUsed)
        console.log('CAN USE: ', libraryPower.usageTimes)
        if (card.specialPowerUsed < libraryPower.usageTimes) {

            const res = libraryPower.execute(data);
            usedCardPower.specialPowerUsed = card.specialPowerUsed + 1

            const usedCardIdx = res.attackerCardsOnBoard.findIndex((attackerCard) => attackerCard.token_id === card.token_id);
            if (usedCardIdx > -1) {
                res.attackerCardsOnBoard[usedCardIdx] = usedCardPower
            }
            return res
        }
        return;
    }
}