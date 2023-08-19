import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { ButtonCustom, PText, allowOnlyNumbersDecimals } from "@/shared";
import { trpc } from "@/utils/trpc";
import { Input } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DefaultDeck from "./components/default_deck";
import { calculateEthToDollar } from "@/utils/functions/calculate_eth_to_usd";

export default function DefaultDeckGenerator() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const errorSuccessActions = useErrorSuccessActions();

    const getAllDefaultDecks = trpc.getAllDefaultDecks.useQuery({});
    const getCurrentGeneration = trpc.getCurrentGeneration.useQuery();
    const createNewDefaultDeck = trpc.createNewDefaultDeck.useMutation();
    const generateDeckImage = trpc.generateImages.useMutation();
    const getETHprice = trpc.getETHprice.useQuery();

    const [deckName, setDeckName] = useState('');
    const [deckDescription, setDeckDescription] = useState('');
    const [deckPrice, setDeckPrice] = useState('0')

    const allDefaultDecks = getAllDefaultDecks?.data ?? [];

    const createDefaultDeck = async () => {
        if (deckName.length > 0 && deckDescription.length > 0) {
            const image = await generateDeckImage.mutateAsync({
                prompt: `${deckName} symbol, center shot`,
                negative_prompt: 'chain',
                modelId: 'ff883b60-9040-4c18-8d4e-ba7522c6b71d',
                promptMagic: true,
                num_images: 1
            })
            if (!image) {
                errorSuccessActions.openErrorSuccess('Could not generate the image for the deck', ErrorSuccessType.ERROR);
                return;
            }
            const imageUrl = image[0].url ?? '';

            await createNewDefaultDeck.mutateAsync({
                walletAddress: user?.walletAddress ?? '',
                description: deckDescription,
                image: imageUrl,
                cards: [],
                deckName: deckName,
                generation: getCurrentGeneration.data?.generation ?? 1,
                randomCards: [],
                price: parseFloat(deckPrice)
            })
            // await getAllDefaultDecks.refetch();
        } else {
            errorSuccessActions.openErrorSuccess('You forgot the name or description', ErrorSuccessType.ERROR)
        }
    }

    const renderDefaultCardCreator = () => <div className="p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30">
        <Input value={deckName} onChange={(e) => setDeckName(e.target.value)} placeholder="Deck name" className="w-full" />
        <Input value={deckDescription} onChange={(e) => setDeckDescription(e.target.value)} placeholder="Describe what is in the deck" className="w-full" />
        <div className="flex items-center justify-start space-x-3">
            <Input value={deckPrice} onChange={(e) => {
                const formatedInput = allowOnlyNumbersDecimals(e.target.value, true)
                if (formatedInput) {
                    setDeckPrice(e.target.value)
                }
            }} title="Deck price in ETH" className="w-full" />
            <p>{calculateEthToDollar(parseFloat(deckPrice), getETHprice.data ? getETHprice.data.ethereum.usd : 0)} USD</p>
        </div>
        <ButtonCustom disabled={generateDeckImage.isLoading || createNewDefaultDeck.isLoading} isLoading={generateDeckImage.isLoading || createNewDefaultDeck.isLoading} title="Create" onClick={createDefaultDeck} className="w-full" />
    </div>

    return <div className="p-3 overflow-y-auto h-120">
        {allDefaultDecks.length > 0 ? <div className="grid grid-cols-2 gap-3">
            {renderDefaultCardCreator()}
            {allDefaultDecks.map((deck: any, index: number) => {
                return <DefaultDeck key={index} deck={deck} />
            })}
        </div> : <div className="space-y-1">
            <div className="flex items-center justify-center">
                <PText>No default decks created</PText>
            </div>
            <div className="grid grid-cols-2">
                {renderDefaultCardCreator()}
            </div>
        </div>}
    </div>
}