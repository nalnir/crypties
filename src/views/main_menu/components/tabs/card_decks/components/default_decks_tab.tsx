import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { ButtonCustom } from "@/shared";
import { calculateEthToDollar } from "@/utils/functions/calculate_eth_to_usd";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { CardsViewModal } from "./cards_view";
import { ETHTokenType, Link } from "@imtbl/imx-sdk";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { OriginalCard } from "@/utils";
import { useQuery } from "@tanstack/react-query";
import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useState } from "react";
import { api } from "@/utils/api";

const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';
const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

export const DefaultDecksTab = () => {
    const globalModalActions = useGlobalModalActions();
    const errorSuccessActions = useErrorSuccessActions();
    const getAllDefaultDecks = api.defaultDeck.getAllDefaultDecks.useQuery({ onlyPublished: true });
    const getAllDefaultCards = api.defautlCard.getAllDefaultCards.useQuery();
    const getETHprice = api.other.getETHprice.useQuery();
    const bumpTokenId = api.cardCreation.bumpTokenId.useMutation();
    const mintTokens = api.cardCreation.mintBulk.useMutation();
    const getLatestCardId = api.cardCreation.getCurrentCardId.useQuery();
    const uploadMetadataToIPFS = api.cardCreation.uploadMetadataToIPFS.useMutation();
    const uploadMetadataToS3 = api.cardCreation.uploadMetadataToS3.useMutation();
    const createUserDefaultDeck = api.user.createUserDeck.useMutation();

    const { data: user, isLoading: loadingUser, isError } = useQuery<UserDocument>(['user']);

    const allDecks = getAllDefaultDecks.data ?? [];
    const allDefaultCards = getAllDefaultCards.data ?? []

    const [isLoading, setIsLoading] = useState(false);

    const pickRandomChanceCards = async (deck: any) => {
        return deck.map((deckCard: any) => {
            const matchingCards = allDefaultCards.filter(card => card.metadata.cardType === deckCard.cardType);
            if (matchingCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * matchingCards.length);
                return matchingCards[randomIndex];
            } else {
                return null; // No matching card found
            }
        });
    }

    const buyDeck = async (deck: any) => {
        setIsLoading(true)
        const res = await pickRandomChanceCards(deck.randomCards)
        const matchedFixedCards = allDefaultCards.filter((defaultCard: any) =>
            deck.cards.some((defaultDeckCard: any) => defaultCard._id === defaultDeckCard.cardId)
        );
        const mergedArray = [...matchedFixedCards, ...res];
        const allCardTokens: string[] = [];
        try {
            // const res = await link.transfer([{
            //     amount: deck.price.toString(),
            //     type: ETHTokenType.ETH,
            //     toAddress: process.env.NEXT_PUBLIC_SUPERADMIN_ADDRESS ?? ''
            // }])
            const numberOfTokensToMint = deck.cards.reduce((acc: number, val: any) => acc + val.amountOfCards, 0) + deck.randomCards.reduce((acc: number, val: any) => acc + val.amountOfCards, 0)

            let cardToBeMinted: any = {
                name: mergedArray[0].name,
                description: mergedArray[0].description,
                image_url: mergedArray[0].image_url,
                metadata: {
                    health: mergedArray[0].metadata.health,
                    attackPower: mergedArray[0].metadata.attackPower,
                    creatorPlayerName: mergedArray[0].metadata.creatorPlayerName,
                    creatorAddress: mergedArray[0].metadata.creatorAddress,
                    creatorLoreName: mergedArray[0].metadata.creatorLoreName,
                    cardType: mergedArray[0].metadata.cardType,
                    cardTypeId: mergedArray[0].metadata.cardTypeId,
                    generation: mergedArray[0].metadata.generation,
                    imageId: mergedArray[0].metadata.imageId,
                    default: true
                },
            }
            const cid = await uploadMetadataToIPFS.mutateAsync(cardToBeMinted)
            // const result = await Promise.all(mergedArray.map(async (card: any, index: number) => {
            //     let deckCardMatch = deck.cards.find((deckCard: any) => deckCard.cardId === card._id)
            //     if (!deckCardMatch) {
            //         deckCardMatch = deck.randomCards.find((randomDeckCard: any) => randomDeckCard.cardType === card.metadata.cardType)
            //     }

            //     let cardToBeMinted: any = {
            //         name: card.name,
            //         description: card.description,
            //         image_url: card.image_url,
            //         metadata: {
            //             health: card.metadata.health,
            //             attackPower: card.metadata.attackPower,
            //             creatorPlayerName: card.metadata.creatorPlayerName,
            //             creatorAddress: card.metadata.creatorAddress,
            //             creatorLoreName: card.metadata.creatorLoreName,
            //             cardType: card.metadata.cardType,
            //             cardTypeId: card.metadata.cardTypeId,
            //             generation: card.metadata.generation,
            //             imageId: card.metadata.imageId,
            //             default: true
            //         },
            //     }

            //     if (card.metadata.special) {
            //         cardToBeMinted.metadata.special = card.metadata.special
            //     }

            //     if (card.metadata.manaCost) {
            //         cardToBeMinted.metadata.manaCost = card.metadata.manaCost
            //     }

            //     // const cid = await uploadMetadataToIPFS.mutateAsync(cardToBeMinted)
            //     // if (!cid) {
            //     //     console.log('Card: ', card)
            //     //     errorSuccessActions.openErrorSuccess('Could not upload metadata for: ', card.name)
            //     //     return
            //     // }
            //     // cardToBeMinted.metadata.ipfsCID = cid;

            //     const allPromises = await Promise.all(
            //         Array.from({ length: deckCardMatch.amountOfCards }, (_, i) => i).map(async (i) => {
            //             const res: any = await bumpTokenId.mutateAsync({
            //                 generation: card.metadata.generation
            //             })
            //             allCardTokens.push(res.amountOfCardsForged.toString())
            //             await uploadMetadataToS3.mutateAsync({
            //                 original_card: card,
            //                 tokenId: res.amountOfCardsForged,
            //             })

            //             await mintTokens.mutateAsync({
            //                 walletAddress: user?.walletAddress ?? '',
            //                 tokenId: res.amountOfCardsForged,
            //                 number_of_tokens_to_mint: 1
            //             })
            //         })
            //     )
            //     return allPromises;
            // }))
            // await createUserDefaultDeck.mutateAsync({
            //     walletAddress: user?.walletAddress ?? '',
            //     image: deck.image,
            //     deckName: deck.deckName,
            //     cards: allCardTokens,
            //     default: true
            // })

            setIsLoading(false)
            // return result;
        } catch (e) {
            console.log('e: ', e)
            errorSuccessActions.openErrorSuccess('Something went wrong. Please try again', ErrorSuccessType.ERROR)
            setIsLoading(false)
        }
    }

    return <div className="grid grid-cols-3">
        {allDecks.map((deck, index) => {
            return <div key={index}
                style={{
                    backgroundImage: `url(${deck.image})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                }}
                className={`p-3 space-y-3 border border-separate border-black rounded-lg shadow-xl shrink-1 border-opacity-30`}
            >
                <div>
                    <p>{capitalizeFirstLetter(deck.deckName)}</p>
                    <p>{capitalizeFirstLetter(deck.description)}</p>
                    <p>Price: {deck.price} ETH / {calculateEthToDollar(deck.price, getETHprice.data ? getETHprice.data.ethereum.usd : 0)} USD</p>
                </div>
                <div className="flex items-center justify-center space-x-3">
                    <ButtonCustom className="w-full" title="View" onClick={() => globalModalActions.openGlobalModal(<CardsViewModal deck={deck} />)}></ButtonCustom>
                    <ButtonCustom isLoading={isLoading} disabled={isLoading} className="w-full" title="Buy" onClick={() => buyDeck(deck)}></ButtonCustom>
                </div>
            </div>
        })}
    </div>
}