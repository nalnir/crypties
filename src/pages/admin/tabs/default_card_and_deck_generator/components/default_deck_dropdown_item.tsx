import { DefaultDeckDocument } from "@/pages/api/schemas/default_deck_schema";
import { PText, allowOnlyNumbersDecimals } from "@/shared";
import { CardInDefaultDeck } from "@/utils";
import { MenuItem } from "@mui/material";
import { Dropdown, TextInput } from "flowbite-react";
import { useRef, useState } from "react";

interface DefaultDeckDropdownItemProps {
    deck: any,
    defaultCard: any
    addRemoveFromDeck: (deck: DefaultDeckDocument, card: any, amount: number) => void
}
export default function DefaultDeckDropdownItem({ deck, defaultCard, addRemoveFromDeck }: DefaultDeckDropdownItemProps) {
    const card = deck.cards.find((val: CardInDefaultDeck) => val.cardId === defaultCard._id);
    const [amount, setAmount] = useState(card?.amountOfCards ?? 0);
    const inputRef = useRef<HTMLInputElement | null>(null); // Explicitly specify the type

    const handleInputClick = (e: any) => {
        e.stopPropagation();
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const isPartOfDeck = (deck: DefaultDeckDocument, card: any) => {
        const cardExists = deck.cards.find((cardInDeck) => cardInDeck.cardId === card._id);
        if (cardExists) {
            return true;
        }
        return false;
    }

    return <MenuItem className="flex items-center justify-start space-x-1">
        <PText className="text-black">{deck.deckName}</PText>
        <div onClick={handleInputClick}>
            <input ref={inputRef} className="w-10" autoFocus placeholder="Amount" value={amount}
                onChange={(e) => {
                    const formatedInput = allowOnlyNumbersDecimals(e.target.value)
                    if (formatedInput) {
                        setAmount(parseInt(formatedInput))
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                        e.stopPropagation();
                    }
                }}
            />
        </div>
        {isPartOfDeck(deck, defaultCard) ? <PText onClick={() => addRemoveFromDeck(deck, defaultCard, amount)} className="text-black">-</PText> : <PText onClick={() => addRemoveFromDeck(deck, defaultCard, amount)} className="text-black">+</PText>}
    </MenuItem>
}