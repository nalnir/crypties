import { UserDocument } from "@/pages/api/schemas/user_schema";
import { usePlayerCardsActions } from "@/recoil-state/player_cards/player_cards.actions";
import { playerCardsAtom } from "@/recoil-state/player_cards/player_cards.atom";
import { ButtonCustom, PText } from "@/shared";
import { trpc } from "@/utils/trpc";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { OriginalCard } from "@/utils/types/original_card";
import { Dropdown } from "flowbite-react";
import { DeckDocument } from "@/pages/api/schemas/deck_schema";
import { usePlayerDecksActions } from "@/recoil-state/player_decks/player_decks.actions";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";

export const AllCardsTab = () => {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const playerDeckActions = usePlayerDecksActions();
    const errorSuccessActions = useErrorSuccessActions();

    const saveDeck = trpc.saveUserDeck.useMutation();
    const getUserCards = trpc.getUserCards.useQuery({ walletAddress: user?.walletAddress ?? '' });
    const getUserDecks = trpc.getUserDecks.useQuery({ walletAddress: user?.walletAddress ?? '' });

    const allUserCards: any = getUserCards.data ?? [];
    const allUserDecks: any = getUserDecks.data ?? [];

    const addRemoveFromDeck = async (deck: DeckDocument, card: OriginalCard) => {
        const newDeck: DeckDocument = JSON.parse(JSON.stringify(deck))
        const cardIdx = newDeck.cards.findIndex((cardInDeck) => cardInDeck === card.token_id ?? '0');
        if (cardIdx > -1) {
            newDeck.cards.splice(cardIdx, 1)
        } else {
            if (newDeck.cards.length === 30) {
                errorSuccessActions.openErrorSuccess('You can only have 30 cards in the deck', ErrorSuccessType.WARNING);
                return;
            }
            newDeck.cards.push(card.token_id ?? '0')
        }

        const updatedDeck = await saveDeck.mutateAsync({
            deck: newDeck
        })
        if (!updatedDeck) {
            errorSuccessActions.openErrorSuccess('Could not update the deck', ErrorSuccessType.WARNING);
            return
        }
        await getUserDecks.refetch()
        playerDeckActions.replaceDeckInList(updatedDeck)
    }

    const isPartOfDeck = (deck: DeckDocument, card: OriginalCard) => {
        const cardExists = deck.cards.find((cardInDeck) => cardInDeck === card.token_id ?? '0');
        if (cardExists) {
            return true;
        }
        return false;
    }

    const isOnSale = (card: OriginalCard) => {
        if (card.orders?.sell_orders) {
            const sellOrders = card.orders?.sell_orders;
            return sellOrders.some((orders) => orders.user === user?.walletAddress && orders.status === "active")
        }
        return false
    }

    return <div className="grid grid-cols-4 gap-3">
        {allUserCards?.result?.map((card: any, cardIndex: number) => {
            console.log('card: ', card)
            return <div key={cardIndex} className="flex-col items-center justify-center p-3 space-y-3 border border-black rounded-lg shadow-lg border-opacity-30">
                <img src={card.image_url} className="border rounded-md border-secondary-400 w-30 h-30" />
                <div>
                    <PText>{card.name}</PText>
                    <PText>Attack: {card.metadata.attackPower}</PText>
                    <PText>Health: {card.metadata.health}</PText>
                </div>
                {!isOnSale(card) ? <Dropdown disabled={saveDeck.isLoading} label="Add to deck" arrowIcon={false} className="rounded-lg">
                    {allUserDecks.length > 0 ? allUserDecks.map((deck: any, deckIndex: number) => {
                        if (!deck.default) {
                            return <Dropdown.Item onClick={() => addRemoveFromDeck(deck, card)} key={deckIndex} className="flex items-center justify-start space-x-1">
                                <PText className="text-black">{deck.deckName}</PText>
                                {isPartOfDeck(deck, card) ? <PText className="text-black">-</PText> : <PText className="text-black">+</PText>}
                            </Dropdown.Item>
                        }
                        return <></>
                    }) : <Dropdown.Item><PText className="text-black">You have no decks</PText></Dropdown.Item>}
                </Dropdown> : <></>}
            </div>
        })}
    </div >
}