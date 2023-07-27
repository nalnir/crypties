import { UserDocument } from "@/pages/api/schemas/user_schema";
import { playerCardAtom } from "@/recoil-state/player_cards/player_card/player_card.atom";
import { usePlayerCardsActions } from "@/recoil-state/player_cards/player_cards.actions";
import { playerCardsAtom } from "@/recoil-state/player_cards/player_cards.atom";
import { PText } from "@/shared";
import { trpc } from "@/utils/trpc";
import { OriginalCard } from "@/utils/types/original_card";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

function CardDecksTab() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const playerCardsState = useRecoilValue(playerCardsAtom);
    const playerCardsActions = usePlayerCardsActions();

    const getUserCards = trpc.getUserCards.useMutation();

    useEffect(() => {
        if (!playerCardsState.fetched) {
            userCards()
        }
    }, [playerCardsState.fetched])

    const userCards = async () => {
        const userCards = await getUserCards.mutateAsync({
            walletAddress: user?.walletAddress ?? ''
        })
        playerCardsActions.setAllCards(userCards.result as any)
    }

    return <div className="grid grid-cols-4 gap-3">
        {playerCardsState.playerCards.map((card, index) => {
            return <div key={index} className="flex-col items-center justify-center p-3 space-y-3 rounded-lg shadow-lg">
                <img src={card.image_url} className="w-30 h-30" />
                <PText>{card.name}</PText>
            </div>
        })}
    </div>
}

export default CardDecksTab;