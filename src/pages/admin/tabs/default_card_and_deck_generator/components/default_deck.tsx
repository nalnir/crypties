import { ButtonCustom, PText, allowOnlyNumbersDecimals } from "@/shared"
import { CardInDefaultDeck } from "@/utils"
import { RandomCardInDefaultDeck } from "@/utils/types/random_card_in_default_deck"
import { Dropdown } from "flowbite-react"
import DefaultCardType from "./default_card_type"
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom"
import { DefaultDeckDocument } from "@/pages/api/schemas/default_deck_schema"
import { CardTypeDocument } from "@/pages/api/schemas/card_type_schema"
import { trpc } from "@/utils/trpc"
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions"
import { useState } from "react"
import { calculateEthToDollar } from "@/utils/functions/calculate_eth_to_usd"

interface DefaultDeckProps {
    deck: any
}
export default function DefaultDeck({ deck }: DefaultDeckProps) {
    const errorSuccessActions = useErrorSuccessActions();
    const deleteDefaultDeck = trpc.deleteDefaultDeck.useMutation();
    const publishUnpublishDeck = trpc.publishUnpublishDeck.useMutation();
    const updateDefaultDeck = trpc.updateDefaultDeck.useMutation();
    const getAllCardTypes = trpc.getAllCardTypes.useQuery();
    const getAllDefaultDecks = trpc.getAllDefaultDecks.useQuery({});
    const getETHprice = trpc.getETHprice.useQuery();

    const [deckName, setDeckName] = useState(deck.deckName ?? '')
    const [deckDescription, setDeckDescription] = useState(deck.description ?? '')
    const [deckPrice, setDeckPrice] = useState(deck.price ? deck.price.toString() : '0')

    const allCardTypes = getAllCardTypes?.data ?? []

    const updateDeck = async (deck: any) => {
        const newDeck = JSON.parse(JSON.stringify(deck))
        newDeck.deckName = deckName;
        newDeck.description = deckDescription;
        newDeck.price = parseFloat(deckPrice);
        const res: any = await updateDefaultDeck.mutateAsync(newDeck)
        if (!res) {
            errorSuccessActions.openErrorSuccess('Could not updated the deck', ErrorSuccessType.ERROR);
        }
        await getAllDefaultDecks.refetch()
    }

    const deleteDeck = async (deck: any) => {
        const res: any = await deleteDefaultDeck.mutateAsync(deck)
        if (!res) {
            errorSuccessActions.openErrorSuccess('Could not delete the deck', ErrorSuccessType.ERROR);
        }
        await getAllDefaultDecks.refetch();
    }

    const publishDeck = async (deck: any) => {
        const res: any = await publishUnpublishDeck.mutateAsync(deck);
        await getAllDefaultDecks.refetch();
    }

    const addRemoveFromDeck = async (deck: DefaultDeckDocument, cardType: CardTypeDocument, exists: number) => {
        const updatedDeck: any = deck;
        console.log('cardType: ', cardType._id)
        if (exists < 0) {
            updatedDeck.randomCards.push({
                cardType: cardType.name,
                amountOfCards: 0,
                cardTypeId: cardType._id
            })
            const res: any = await updateDefaultDeck.mutateAsync(updatedDeck);
        } else {
            updatedDeck.randomCards.splice(exists, 1)
            const res: any = await updateDefaultDeck.mutateAsync(updatedDeck);
        }
    }

    return <div
        style={{
            backgroundImage: `url(${deck.image})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }}
        className={`p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30`}
    >
        <input onChange={(e) => setDeckName(e.target.value)} className="w-full" value={deckName} />
        <input onChange={(e) => setDeckDescription(e.target.value)} className="w-full" value={deckDescription} />
        <div className="flex items-center justify-start space-x-3">
            <input
                onChange={(e) => {
                    const formatedInput = allowOnlyNumbersDecimals(e.target.value, true)
                    if (formatedInput) {
                        setDeckPrice(e.target.value)
                    }
                }}
                className="w-full"
                value={deckPrice}
            />
            <p>{calculateEthToDollar(deckPrice, getETHprice.data ? getETHprice.data.ethereum.usd : 0)} USD</p>
        </div>
        <PText>{(deck.cards ? deck.cards.reduce((acc: number, val: CardInDefaultDeck) => acc + val.amountOfCards, 0) : 0) + (deck.randomCards ? deck.randomCards.reduce((acc: number, val: RandomCardInDefaultDeck) => acc + val.amountOfCards, 0) : 0)} cards in the deck</PText>
        <ButtonCustom disabled={publishUnpublishDeck.isLoading} isLoading={publishUnpublishDeck.isLoading} title={deck.isPublished ? 'Unpublish' : 'Publish'} onClick={() => publishDeck(deck)} className="w-full" />
        <div className="flex items-center justify-between space-x-3">
            <ButtonCustom disabled={deleteDefaultDeck.isLoading} isLoading={deleteDefaultDeck.isLoading} title="Update" onClick={() => updateDeck(deck)} className="w-full" />
            <ButtonCustom disabled={deleteDefaultDeck.isLoading} isLoading={deleteDefaultDeck.isLoading} title="Delete" onClick={() => deleteDeck(deck)} className="w-full" />
        </div>
        {deck.randomCards.map((randomCard: RandomCardInDefaultDeck, randomCardIdx: number) => {
            return <DefaultCardType key={randomCardIdx} randomCard={randomCard} deck={deck} />
        })}
        <div className="flex items-center justify-between">
            <Dropdown disabled={updateDefaultDeck.isLoading} label="Add random chance card" arrowIcon={false} className="rounded-lg">
                {allCardTypes.length > 0 ? allCardTypes.map((cardType: any, cardTypeIdx: number) => {
                    const deckHasCardType = deck.randomCards.findIndex((randomCard: RandomCardInDefaultDeck) => randomCard.cardTypeId === cardType._id)
                    return <Dropdown.Item onClick={() => addRemoveFromDeck(deck, cardType, deckHasCardType)} key={cardTypeIdx} className="flex items-center justify-start space-x-1">
                        <PText className="text-black">{cardType.name}</PText>
                        <PText className="text-black cursor-pointer">{deckHasCardType < 0 ? '+' : '-'}</PText>
                    </Dropdown.Item>
                }) : <Dropdown.Item><PText className="text-black">No card types</PText></Dropdown.Item>}
            </Dropdown>
        </div>
    </div>
}