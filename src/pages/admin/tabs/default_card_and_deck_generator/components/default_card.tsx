import { ButtonCustom, PText } from "@/shared";
import { trpc } from "@/utils/trpc";
import { Dropdown } from "flowbite-react";
import DefaultDeckDropdownItem from "./default_deck_dropdown_item";
import { DefaultDeckDocument } from "@/pages/api/schemas/default_deck_schema";
import { CardInDefaultDeck } from "@/utils";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { Select } from "@mui/material";

interface DefaultCardProps {
    defaultCard: any
}
export default function DefaultCard({ defaultCard }: DefaultCardProps) {
    const errorSuccessActions = useErrorSuccessActions();
    const publishUnpublishCard = trpc.publishUnpublishDefaultCard.useMutation();
    const updateDefaultDeck = trpc.updateDefaultDeck.useMutation();
    const getAllDefaultCards = trpc.getAllDefaultCards.useQuery();
    const getAllDefaultDecks = trpc.getAllDefaultDecks.useQuery({});

    const allDefaultDecks = getAllDefaultDecks.data ?? [];

    const publishUnpublish = async (defaultCard: any) => {
        await publishUnpublishCard.mutateAsync(defaultCard)
        await getAllDefaultCards.refetch()
    }
    let color = `bg-card-${defaultCard.metadata.cardType}`;

    const addRemoveFromDeck = async (deck: DefaultDeckDocument, card: any, amount: number) => {
        const newDeck: DefaultDeckDocument = JSON.parse(JSON.stringify(deck))
        const newCard: any = JSON.parse(JSON.stringify(card))

        const cardIdx = newDeck.cards.findIndex((cardInDeck: any) => cardInDeck.cardId === newCard._id);
        if (cardIdx > -1) {
            newDeck.cards.splice(cardIdx, 1)
        } else {
            const totalCardsAmount = newDeck.randomCards.reduce((acc: number, val) => acc + val.amountOfCards, 0) + newDeck.cards.reduce((acc: number, val) => {
                let total = 0
                if (val.cardId !== card._id) {
                    total = acc + val.amountOfCards
                }
                return total;
            }, 0);

            if (totalCardsAmount + amount > 30) {
                errorSuccessActions.openErrorSuccess('You can only have 30 cards in the deck', ErrorSuccessType.WARNING);
                return;
            }
            newCard.amountOfCards = amount
            newDeck.cards.push({
                cardId: newCard._id,
                amountOfCards: amount
            })
        }
        const updatedDeck: any = await updateDefaultDeck.mutateAsync(newDeck as any)
        await getAllDefaultDecks.refetch()
    }

    return <div className={`p-5 border rounded-lg ${color}`} >
        <PText className="flex !whitespace-nowrap truncate text-ellipsis">{defaultCard.metadata.cardType}</PText>
        <img src={defaultCard.image_url} className="rounded-lg" alt={defaultCard.name} />
        <PText className="flex !whitespace-nowrap truncate text-ellipsis">{defaultCard.name}</PText>
        <PText>Attack: {defaultCard.metadata.attackPower}</PText>
        <PText>Health: {defaultCard.metadata.health}</PText>
        <ButtonCustom isLoading={publishUnpublishCard.isLoading && getAllDefaultCards.isLoading} disabled={publishUnpublishCard.isLoading && getAllDefaultCards.isLoading} title={defaultCard.isPublished ? 'Unpublish' : 'Publish'} onClick={() => publishUnpublish(defaultCard)} />
        {defaultCard.isPublished ?
            <Dropdown disabled={updateDefaultDeck.isLoading || getAllDefaultDecks.isLoading} label="Decks" autoFocus={false}>
                {allDefaultDecks.length > 0 ? allDefaultDecks.map((deck: any, index) => {
                    return <DefaultDeckDropdownItem addRemoveFromDeck={(deck: DefaultDeckDocument, card: CardInDefaultDeck, amount: number) => addRemoveFromDeck(deck, card, amount)} key={index} defaultCard={defaultCard} deck={deck} />
                }) : <Dropdown.Item><PText className="text-black">You have no decks</PText></Dropdown.Item>}
            </Dropdown> : <></>
        }
    </div>
}