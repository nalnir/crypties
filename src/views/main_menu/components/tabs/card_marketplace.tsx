import { UserDocument } from "@/pages/api/schemas/user_schema";
import { ButtonCustom, PText } from "@/shared";
import { OriginalCard } from "@/utils";
import { trpc } from "@/utils/trpc";
import { IMXAssetCrypties } from "@/utils/types/imx_asset";
import { useQuery } from "@tanstack/react-query";
import { Link } from '@imtbl/imx-sdk';
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { useEffect, useState } from "react";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { CardSaleModal } from "./components";
const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';
const link = new Link(NEXT_PUBLIC_IMX_LINK_ADDRESS, null, 'v3');

function CardMarketPlaceTab() {
    const errorSuccessActions = useErrorSuccessActions();
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const allCards = trpc.getAllCards.useQuery();
    const userBalance = trpc.getUserBalance.useQuery({ walletAddress: user?.walletAddress ?? '' });
    const globalModalActions = useGlobalModalActions();
    const [salePrice, setSalePrice] = useState('0');

    // useEffect(() => {
    //     getBalance()
    // }, [])

    // const getBalance = async () => {
    //     const balance = await userBalance.mutateAsync({
    //         walletAddress: user?.walletAddress ?? ''
    //     })
    //     console.log('balance: ', balance)
    // }

    const isUsersCard = (card: any) => {
        return user?.walletAddress === card.user
    }

    const listOnMarketPlace = async (card: any, price: string) => {
        try {
            const res = await link.sell({
                tokenId: card.token_id,
                tokenAddress: card.token_address,
                amount: price,
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

    const buy = async (activeOrder: any) => {
        try {
            const res = await link.buy({
                orderIds: [activeOrder.order_id]
            })
            console.log('res: ', res)
        } catch (e) {
            console.log('e: ', e)
            errorSuccessActions.openErrorSuccess('Something went wrong. Please try again', ErrorSuccessType.ERROR)
        }
    }

    const cancelSellOrder = async (card: any) => {
        if (card.orders?.sell_orders) {
            const activeOrder = card.orders.sell_orders.find((order: any) => order.status === "active");
            try {
                const res = await link.cancel({
                    orderId: activeOrder.order_id
                })
                console.log('res: ', res)
            } catch (e) {
                console.log('e: ', e)
                errorSuccessActions.openErrorSuccess('Something went wrong. Please try again', ErrorSuccessType.ERROR)
            }
        }
        return
    }

    const renderBuyButton = (card: any) => {
        if (card.orders?.sell_orders) {
            const activeOrder = card.orders.sell_orders.find((order: any) => order.status === "active");
            if (activeOrder) {
                return <ButtonCustom disabled={parseInt(userBalance.data ?? '0') <= 0} title={`Buy for`} onClick={() => buy(activeOrder)} />
            }
            return <PText>Not for sale</PText>
        }
        return <PText>Not for sale</PText>
    }

    const renderSellCancelButton = (card: any) => {
        if (card.orders?.sell_orders) {
            const activeOrder = card.orders.sell_orders.find((order: any) => order.status === "active");
            if (activeOrder) {
                return <ButtonCustom title={`Cancel order`} onClick={() => cancelSellOrder(card)} />
            }
            return <></>
        }
        return <ButtonCustom title="Sell" onClick={() => globalModalActions.openGlobalModal(<CardSaleModal card={card} listOnMarketPlace={(card: any, price: string) => listOnMarketPlace(card, price)} />)} />
    }

    return <div className="grid grid-cols-4 gap-3">
        {allCards?.data?.result?.map((card: any, index) => {
            return <div key={index} className={`${isUsersCard(card) ? 'bg-primary-500' : ''} p-3 border border-black rounded-lg border-opacity-30`}>
                <img src={card.image_url ?? ''} alt="Card image" />
                {isUsersCard(card) ? renderSellCancelButton(card) : renderBuyButton(card)}
            </div>
        })}
    </div>
}

export default CardMarketPlaceTab;