import { enemyCardAtom } from "@/recoil-state/enemy_cards/enemy_card/enemy_card.atom";
import { useEnemyCardsActions } from "@/recoil-state/enemy_cards/enemy_cards.actions";
import { enemyCardsAtom } from "@/recoil-state/enemy_cards/enemy_cards.atom";
import { useGameActions } from "@/recoil-state/game/game.actions";
import { usePlayerCardActions } from "@/recoil-state/player_cards/player_card/player_card.actions";
import { playerCardAtom } from "@/recoil-state/player_cards/player_card/player_card.atom";
import { handleAttackTargetCard, handleGameOver, handleKillCard } from "@/utils/functions/gameplay_mechanics";
import { PlayingCardModel } from "@/utils/mocks/player_deck";
import { useEffect, useState } from "react";
import { animated, config, useSpring } from "react-spring"
import { useRecoilState, useRecoilValue } from "recoil";

interface PlayerCardProps {
    cardIndex: number,
    card: PlayingCardModel
}
export const PlayerCard = ({ cardIndex, card }: PlayerCardProps) => {
    const gameActions = useGameActions();

    const cardActions = usePlayerCardActions();
    const playerCardState = useRecoilValue(playerCardAtom)

    const enemyCardState = useRecoilValue(enemyCardAtom)
    const enemyCardsState = useRecoilValue(enemyCardsAtom)
    const enemyCardsActions = useEnemyCardsActions();

    const [isAttacking, setIsAttacking] = useState(false);


    useEffect(() => { }, [playerCardState.isPicked])
    useEffect(() => {
        if (playerCardState.isPicked === cardIndex && enemyCardState.cardCoordinates) {
            setIsAttacking(true)
            const enemyCardHit = handleAttackTargetCard(enemyCardState.enemyCard, card)

            const enemyCardsOnTheBoard = JSON.parse(JSON.stringify(enemyCardsState.enemyCardsOnTheBoard))
            const enemyCardsTotal = JSON.parse(JSON.stringify(enemyCardsState.enemyCards))

            if (enemyCardHit && enemyCardState.enemyCardIdx !== null) {
                // Checks if hit card has no health
                if (enemyCardHit.health <= 0) {
                    // TODO: Play kill animation
                    const transformedDeck = handleKillCard(enemyCardHit, enemyCardsOnTheBoard, enemyCardsTotal)

                    if (!transformedDeck) {
                        gameActions.handleGameOver()
                        handleGameOver()
                        return;
                    }

                    if (transformedDeck.enemyCardsOnBoard.length < 1) {
                        gameActions.handleGameOver()
                        handleGameOver()
                        return;
                    }

                    enemyCardsActions.placeCardsInTheDeck(transformedDeck.enemyTotalCards)
                    enemyCardsActions.placeCardsOnTheBoard(transformedDeck.enemyCardsOnBoard)
                    return;
                }

                const affectedCardFromTotalCards = enemyCardsTotal.findIndex((card: PlayingCardModel) => card.id === enemyCardHit.id)
                const affectedCardOnBoard = enemyCardsOnTheBoard.findIndex((card: PlayingCardModel) => card.id === enemyCardHit.id)

                enemyCardsTotal[affectedCardFromTotalCards] = enemyCardHit
                enemyCardsOnTheBoard[affectedCardOnBoard] = enemyCardHit

                // console.log('enemyCardHit: ', enemyCardHit)
                // console.log('enemyCardsTotal[affectedCardFromTotalCards]: ', enemyCardsTotal[affectedCardFromTotalCards])
                // console.log('enemyCardsOnTheBoard[affectedCardOnBoard]: ', enemyCardsOnTheBoard[affectedCardOnBoard])

                enemyCardsActions.placeCardsInTheDeck(enemyCardsTotal)
                enemyCardsActions.placeCardsOnTheBoard(enemyCardsOnTheBoard);
                return;
            }
        } else {
            setIsAttacking(false)
        }
    }, [enemyCardState.cardCoordinates])

    const handleSelect = (e: any) => {
        const cardElement = e.currentTarget;
        const cardRect = cardElement.getBoundingClientRect();
        cardActions.setPlayerCardForAttacking({ left: cardRect.left, top: cardRect.top }, card)
        cardActions.pickCard(cardIndex)
    }

    const cardAnimation = useSpring({
        transform: `${playerCardState.isPicked === cardIndex ? 'translateY(-10px)' : 'translateY(0)'} ${isAttacking ? `translate(${enemyCardState.cardCoordinates?.left}, ${enemyCardState.cardCoordinates?.top})` : `translate(${0}px, ${0}px)`}`,
        boxShadow: playerCardState.isPicked === cardIndex ? '0 10px 20px rgba(0, 0, 0, 0.5)' : '0 5px 10px rgba(0, 0, 0, 0.2)',
        config: config.stiff
    });

    return <animated.div
        onClick={handleSelect}
        className="relative p-3 space-y-3 bg-green-300 rounded-lg shadow-lg cursor-pointer grow max-h-80 h-80"
        style={cardAnimation}
    >
        <div className="relative border-2 rounded-lg border-primary-500">
            <img className="rounded-lg" src={'/textures/card_image_placeholders/imp.png'} alt="Creature picture" />
            <div className="absolute top-0 right-0 space-y-5">
                <div className="flex items-center justify-center w-10 h-10 transform rotate-45 bg-purple-100">
                    <div className="-rotate-45">{card.attackPower}</div>
                </div>
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full shadow-lg">
                    <div>{card.health}</div>
                </div>
            </div>
        </div>
        <div className="flex flex-col justify-between">
            <div className="flex items-center justify-center">
                {card.name}
            </div>
            <div className="line-clamp-4">
                {card.desc}
            </div>
        </div>
    </animated.div>
}