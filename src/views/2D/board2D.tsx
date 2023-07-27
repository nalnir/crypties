import { useEnemyCardsActions } from "@/recoil-state/enemy_cards/enemy_cards.actions";
import { enemyCardsAtom } from "@/recoil-state/enemy_cards/enemy_cards.atom";
import { gameAtom } from "@/recoil-state/game/game.atom";
import { usePlayerCardsActions } from "@/recoil-state/player_cards/player_cards.actions";
import { playerCardsAtom } from "@/recoil-state/player_cards/player_cards.atom";
import { EnemyCard } from "@/shared/components/enemy_card";
import { PlayerCard } from "@/shared/components/player_card";
import withAuth from "@/shared/functions/with_auth";
import { pickFirstFiveCards } from "@/utils/functions/gameplay_mechanics";
import { enemyCardDeck } from "@/utils/mocks/enemy_deck";
import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";


function Board2D() {
    const gameState = useRecoilValue(gameAtom);

    const playerCardsState = useRecoilValue(playerCardsAtom);
    const playerCardsAction = usePlayerCardsActions();

    const enemyCardsState = useRecoilValue(enemyCardsAtom);
    const enemyCardsAction = useEnemyCardsActions();

    // useEffect(() => {
    //     const currentPlayerCards = playerCardsState.playerCards;
    //     if (currentPlayerCards.length < 1 && !gameState.gameOver) {
    //         playerCardsAction.initializeFullDeck(enemyCardDeck)
    //         playerCardsAction.placeCardsOnTheBoard(pickFirstFiveCards(enemyCardDeck))
    //     }
    // }, [playerCardsState.playerCards])

    useEffect(() => {
        const currentEnemyCards = enemyCardsState.enemyCards;
        if (currentEnemyCards.length < 1 && !gameState.gameOver) {
            enemyCardsAction.initializeFullDeck(enemyCardDeck)
            enemyCardsAction.placeCardsOnTheBoard(pickFirstFiveCards(enemyCardDeck))
        }
    }, [enemyCardsState.enemyCards])

    return (
        <div className="flex-col h-screen p-3 bg-primary-400">
            <div className="grid justify-between h-full">

                <div className="grid items-start grid-cols-5 gap-x-5">
                    {enemyCardsState.enemyCardsOnTheBoard.map((card: PlayingCardModel, index: number) =>
                        <EnemyCard
                            key={index}
                            cardIndex={index}
                            card={card}
                        />
                    )}
                </div>
                {/* 
                <div className="grid items-start grid-cols-5 gap-x-3">
                    {playerCardsState.playerCardsOnTheBoard.map((card: PlayingCardModel, index: number) =>
                        <PlayerCard
                            key={card.id}
                            cardIndex={index}
                            card={card}
                        />
                    )}
                </div> */}

            </div>
        </div>
    );
}

export default Board2D