import { UserDocument } from "@/pages/api/schemas/user_schema";
import { ButtonCustom } from "@/shared";
import { OriginalCard } from "@/utils";
import { trpc } from "@/utils/trpc";
import { IMXAssetCrypties } from "@/utils/types/imx_asset";
import { useQuery } from "@tanstack/react-query";
import { Link } from '@imtbl/imx-sdk';
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';

function CardMarketPlaceTab() {
    const errorSuccessActions = useErrorSuccessActions();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const allCards = trpc.getAllCards.useQuery();

    const isUsersCard = (card: any) => {
        return user?.walletAddress === card.user
    }

    const listOnMarketPlace = async (card: any) => {
        console.log(card)
        const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

        try {
            const res = await link.makeOffer({
                tokenId: card.token_id,
                tokenAddress: card.token_address,
                amount: "0.25",
                fees: [{
                    recipient: card.metadata.creatorAddress,
                    percentage: 3
                }]
            })
            console.log('res: ', res)
        } catch (e) {
            console.log('e: ', e)
            errorSuccessActions.openErrorSuccess('Something went wrong. Please try again', ErrorSuccessType.ERROR)
        }
    }

    return <div className="grid grid-cols-4 gap-3">
        {allCards?.data?.result?.map((card: any, index) => {
            return <div key={index} className={`${isUsersCard(card) ? 'bg-primary-500' : ''} p-3 border border-black rounded-lg border-opacity-30`}>
                <img src={card.image_url ?? ''} alt="Card image" />
                {isUsersCard(card) ? <ButtonCustom title="List on marketplace" onClick={() => listOnMarketPlace(card)} /> : <></>}
            </div>
        })}
    </div>
}

export default CardMarketPlaceTab;