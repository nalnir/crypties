
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { ButtonCustom, PText, allowOnlyNumbersDecimals } from "@/shared";
import { CardInDefaultDeck } from "@/utils";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { trpc } from "@/utils/trpc";
import { RandomCardInDefaultDeck } from "@/utils/types/random_card_in_default_deck";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface DefaultCardTypeProps {
    randomCard: RandomCardInDefaultDeck;
    deck: any;
}
const deckAmountOfCardsAllowed = process.env.NEXT_PUBLIC_DECK_AMOUNT_OF_CARDS ?? '30';
export default function DefaultCardType({ randomCard, deck }: DefaultCardTypeProps) {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const errorSuccessActions = useErrorSuccessActions();
    const updateDefaultDeck = trpc.updateDefaultDeck.useMutation();
    const getAllDefaultDecks = trpc.getAllDefaultDecks.useQuery({});
    const [amount, setAmount] = useState(randomCard.amountOfCards);
    const allDefaultDecks = getAllDefaultDecks?.data ?? [];

    const update = async () => {
        console.log('deck.randomCards: ', deck.randomCards)
        const allowedAmount = parseInt(deckAmountOfCardsAllowed)
        const totalCurrentAmount = deck.cards.reduce((acc: number, val: CardInDefaultDeck) => acc + val.amountOfCards, 0) + deck.randomCards.reduce((acc: number, val: RandomCardInDefaultDeck) => {
            let final = acc;
            if (val.cardTypeId !== randomCard.cardTypeId) {
                final = acc + val.amountOfCards
            }
            return final;
        }, 0);
        console.log('totalCurrentAmount: ', totalCurrentAmount)
        if (totalCurrentAmount + amount > allowedAmount) {
            errorSuccessActions.openErrorSuccess(`Total amount of cards exceedes ${allowedAmount}`, ErrorSuccessType.ERROR)
            setAmount(randomCard.amountOfCards)
            return
        }
        const currentRandomCardIdx = deck.randomCards.findIndex((card: RandomCardInDefaultDeck) => card.cardTypeId === randomCard.cardTypeId)
        const updatedDeck = deck;
        updatedDeck.randomCards[currentRandomCardIdx].amountOfCards = amount;
        await updateDefaultDeck.mutateAsync(updatedDeck);
        await getAllDefaultDecks.refetch();
    }

    const remove = async () => {
        const currentRandomCardIdx = deck.randomCards.findIndex((card: RandomCardInDefaultDeck) => card.cardTypeId === randomCard.cardTypeId)
        const updatedDeck = deck;
        updatedDeck.randomCards.splice(currentRandomCardIdx, 1)
        await updateDefaultDeck.mutateAsync(updatedDeck);
        await getAllDefaultDecks.refetch();
    }

    return <div className="flex items-center justify-center space-x-1">
        <p>{capitalizeFirstLetter(randomCard.cardType)}</p>
        <input className="w-1/4" value={amount} onChange={(e) => {
            const formatedInput = allowOnlyNumbersDecimals(e.target.value)
            if (formatedInput) {
                setAmount(parseInt(formatedInput))
            }
        }} />
        <ButtonCustom title="Save" onClick={update} />
        <ButtonCustom title="Delete" onClick={remove} />
    </div>
}