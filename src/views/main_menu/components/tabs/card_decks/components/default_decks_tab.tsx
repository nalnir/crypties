import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { ButtonCustom } from "@/shared";
import { calculateEthToDollar } from "@/utils/functions/calculate_eth_to_usd";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter";
import { trpc } from "@/utils/trpc"
import { CardsViewModal } from "./cards_view";
import { ETHTokenType, Link } from "@imtbl/imx-sdk";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";

const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';
const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

export const DefaultDecksTab = () => {
    const globalModalActions = useGlobalModalActions();
    const errorSuccessActions = useErrorSuccessActions();
    const getAllDefaultDecks = trpc.getAllDefaultDecks.useQuery({ onlyPublished: true });
    const getAllDefaultCards = trpc.getAllDefaultCards.useQuery();
    const getETHprice = trpc.getETHprice.useQuery();
    const allDecks = getAllDefaultDecks.data ?? [];
    const allDefaultCards = getAllDefaultCards.data ?? []

    const buyDeck = async (deck: any) => {
        const matchedCards = allDefaultCards.filter(defaultCard =>
            deck.cards.some((defaultDeckCard: any) => defaultCard._id === defaultDeckCard.cardId)
        );
        try {
            const res = await link.transfer([{
                amount: deck.price.toString(),
                type: ETHTokenType.ETH,
                toAddress: process.env.NEXT_PUBLIC_SUPERADMIN_ADDRESS ?? ''
            }])

        } catch (e) {
            console.log('e: ', e)
            errorSuccessActions.openErrorSuccess('Something went wrong. Please try again', ErrorSuccessType.ERROR)
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
                    <ButtonCustom className="w-full" title="Buy" onClick={() => buyDeck(deck)}></ButtonCustom>
                </div>
            </div>
        })}
    </div>
}