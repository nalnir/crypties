import { DeckDocument } from "@/pages/api/schemas/deck_schema"
import { UserDocument } from "@/pages/api/schemas/user_schema"
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions"
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom"
import { usePlayerDecksActions } from "@/recoil-state/player_decks/player_decks.actions"
import { ButtonCustom, PText } from "@/shared"
import { trpc } from "@/utils/trpc"
import { Input } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

interface AllDecksTabProps {
    playerDecks: DeckDocument[]
}
export const AllDecksTab = ({ playerDecks }: AllDecksTabProps) => {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const errorSuccessActions = useErrorSuccessActions();
    const playerDeckActions = usePlayerDecksActions();
    const [deckName, setDeckName] = useState('');

    const createNewDeck = trpc.createUserDeck.useMutation();
    const deleteUserDeck = trpc.deleteUserDeck.useMutation();
    const getUserDecks = trpc.getUserDecks.useMutation();

    const createDeck = async () => {
        if (deckName.length > 0) {
            const newDeck: any = await createNewDeck.mutateAsync({
                deckName: deckName,
                walletAddress: user?.walletAddress ?? ''
            })

            playerDeckActions.setAddDeckToList(newDeck)
        } else {
            errorSuccessActions.openErrorSuccess('You forgot the name', ErrorSuccessType.ERROR)
        }
    }

    const deleteDeck = async (deck: DeckDocument) => {
        const res: any = await deleteUserDeck.mutateAsync({
            deck: deck
        })
        if (res) {
            playerDeckActions.removeDeckFromList(res)
        } else {
            errorSuccessActions.openErrorSuccess('Could not delete the deck, please try again', ErrorSuccessType.ERROR)
        }
    }

    return <div className="p-3">
        {playerDecks.length > 0 ? <div className="grid grid-cols-4 gap-3">
            <div className="p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30">
                <Input value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder="Deck name" className="w-full" />
                <ButtonCustom isLoading={createNewDeck.isLoading} title="Create" onClick={createDeck} className="w-full" />
            </div>
            {playerDecks.map((deck, index) => {
                return <div key={index} className="p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30">
                    <PText>{deck.deckName}</PText>
                    <PText>{deck.cards.length ?? 0} cards in the deck</PText>
                    <ButtonCustom isLoading={deleteUserDeck.isLoading} title="Delete" onClick={() => deleteDeck(deck)} className="w-full" />
                </div>
            })}
        </div> : <div className="space-y-1">
            <div className="flex items-center justify-center">
                <PText>You have no custom decks</PText>
            </div>
            <div className="grid grid-cols-4">
                <div className="p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30">
                    <Input value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder="Deck name" className="w-full" />
                    <ButtonCustom isLoading={createNewDeck.isLoading} title="Create" onClick={createDeck} className="w-full" />
                </div>
            </div>
        </div>}
    </div>
}