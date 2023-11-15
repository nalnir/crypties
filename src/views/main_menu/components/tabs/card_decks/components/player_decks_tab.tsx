import { DeckDocument } from "@/pages/api/schemas/deck_schema"
import { UserDocument } from "@/pages/api/schemas/user_schema"
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions"
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom"
import { usePlayerDecksActions } from "@/recoil-state/player_decks/player_decks.actions"
import { ButtonCustom, PText } from "@/shared"
import { api } from "@/utils/api"
import { Input } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

export const PlayerDecksTab = () => {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const errorSuccessActions = useErrorSuccessActions();
    const playerDeckActions = usePlayerDecksActions();
    const [deckName, setDeckName] = useState('');

    const createNewDeck = api.user.createUserDeck.useMutation();
    const deleteUserDeck = api.user.deleteUserDeck.useMutation();
    const getUserDecks = api.user.getUserDecks.useQuery({ walletAddress: user?.walletAddress ?? '' });
    const generateDeckImage = api.ai.generateImages.useMutation();

    const userDecks = getUserDecks.data ?? [];

    const createDeck = async () => {
        if (deckName.length > 0) {
            const image = await generateDeckImage.mutateAsync({
                prompt: `${deckName} crystal, center shot, good magical background`,
                negative_prompt: 'text, face, people, bizzare, weird, character, signature, title, watermark',
                modelId: 'd69c8273-6b17-4a30-a13e-d6637ae1c644',
                promptMagic: false,
                num_images: 1
            })
            if (!image) {
                errorSuccessActions.openErrorSuccess('Could not generate the image for the deck', ErrorSuccessType.ERROR);
                return;
            }
            const imageUrl = image[0].url ?? '';

            const newDeck: any = await createNewDeck.mutateAsync({
                deckName: deckName,
                walletAddress: user?.walletAddress ?? '',
                image: imageUrl
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
        {userDecks.length > 0 ? <div className="grid grid-cols-4 gap-3">
            <div className="p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30">
                <Input value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder="Deck name" className="w-full" />
                <ButtonCustom isLoading={createNewDeck.isLoading} title="Create" onClick={createDeck} className="w-full" />
            </div>
            {userDecks.map((deck: any, index: number) => {
                return <div key={index}
                    style={{
                        backgroundImage: `url(${deck.image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }}
                    className={`p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30`}
                >
                    <PText>{deck.deckName}</PText>
                    <PText>{deck.cards.length ?? 0} {deck.cards.length === 1 ? 'card' : 'cards'} in the deck</PText>
                    {!deck.default ? <ButtonCustom isLoading={deleteUserDeck.isLoading} title="Delete" onClick={() => deleteDeck(deck)} className="w-full" /> : <></>}
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