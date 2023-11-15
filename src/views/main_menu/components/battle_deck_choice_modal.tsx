import { UserDocument } from "@/pages/api/schemas/user_schema";
import { useBattleActions } from "@/recoil-state/battle";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import { usePlayerDecksActions } from "@/recoil-state/player_decks/player_decks.actions";
import { useUserActions } from "@/recoil-state/user/user.actions";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

interface BattleDeckChoiceModalProps {
    playableDecks: any[]
}
function BattleDeckChoiceModal({ playableDecks }: BattleDeckChoiceModalProps) {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const router = useRouter();
    const globalModal = useGlobalModalActions();
    const playerDeckActions = usePlayerDecksActions();
    const battleActions = useBattleActions();
    const getUserCards = api.imx.getUserCards.useQuery({ walletAddress: user?.walletAddress ?? '' })

    const allPlayerCards = getUserCards.data?.result ?? [];

    const enterBattleLobby = (deck: any) => {
        const matchedCards = allPlayerCards.filter((defaultCard) =>
            deck.cards.some((defaultDeckCard: any) => defaultCard.token_id === defaultDeckCard)
        );

        playerDeckActions.setBattleDeck(matchedCards);
        battleActions.setActiveBattleDeck(matchedCards);
        battleActions.setBattleDeckId(deck._id)
        globalModal.closeGlobalModal()
        router.push('/battle')
    }

    return <div className="grid items-center justify-center grid-cols-4 gap-3">
        {playableDecks.map((deck: any, index: number) => {
            return <div onClick={() => enterBattleLobby(deck)} key={index} className="p-3 border border-black rounded-lg cursor-pointer">
                <img src={deck.image} />
                <p className="text-lg text-black">{deck.deckName}</p>
            </div>
        })}
    </div>
}

export default BattleDeckChoiceModal;