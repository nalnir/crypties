import { ButtonCustom, PText, allowOnlyNumbersDecimals } from "@/shared"
import { useState } from "react";

interface CardSaleModalProps {
    card: any,
    listOnMarketPlace: (card: any, price: string) => void;
}
export const CardSaleModal = ({ card, listOnMarketPlace }: CardSaleModalProps) => {
    const [salePrice, setSalePrice] = useState('0');

    return <div className="flex-col items-center justify-center p-3 space-y-3 bg-white">
        <img src={card.image_url ?? ''} alt="Card image" />
        <PText className="font-bold text-black">{card.name}</PText>
        <PText className="text-black">{card.description}</PText>
        <div className="flex items-center justify-start space-x-3">
            <input value={salePrice} onChange={(e) => {
                const formated = allowOnlyNumbersDecimals(e.target.value)
                if (formated) {
                    setSalePrice(formated)
                }
            }} />
            <ButtonCustom disabled={parseFloat(salePrice) <= 0} onClick={() => listOnMarketPlace(card, salePrice)} title={"Sell"} />
        </div>
    </div>
}