import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { ButtonCustom, PText, allowOnlyNumbersDecimals } from "@/shared"
import { removeSingleWhiteSpace } from "@/utils/functions/remove_single_white_space";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

export const GameSettings = () => {
    const [cardType, setCardType] = useState('');
    const [power, setPower] = useState(0);
    const createCardType = trpc.createCardType.useMutation();
    const errorSuccessActions = useErrorSuccessActions();

    const create = async () => {
        const res = await createCardType.mutateAsync({
            power: power,
            name: removeSingleWhiteSpace(cardType).toLowerCase()
        })
        if (res) {
            errorSuccessActions.openErrorSuccess('Card type created', ErrorSuccessType.SUCCESS)
        }
    }

    return <div className="space-y-3">
        <div className="space-y-1">
            <PText>Card type</PText>
            <div>
                <input placeholder="Card type" value={cardType} onChange={(e) => setCardType(e.target.value)} />
            </div>
            <div className="space-y-1">
                <PText>Card power</PText>
                <input placeholder="Power" value={power} onChange={(e) => {
                    const formated = allowOnlyNumbersDecimals(e.target.value)
                    if (formated) {
                        const parsed = parseInt(formated)
                        if (parsed > 1000) {
                            errorSuccessActions.openErrorSuccess('Cannot be over 1000');
                            return
                        }
                        setPower(parseInt(formated))
                    }
                }} />
            </div>
            <ButtonCustom isLoading={createCardType.isLoading} disabled={createCardType.isLoading} onClick={create} title="Create card type" />
        </div>
    </div>
}