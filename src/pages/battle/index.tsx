import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import socketIOClient from 'socket.io-client';
import { UserDocument } from "../api/schemas/user_schema";
import { useQuery } from "@tanstack/react-query";
import socket from "../../socket/socket";
import { AuthGuard } from "@/recoil-state/auth/auth.guard";
import { useRecoilValue } from "recoil";
import { battleLobbyAtom, useBattleLobbyActions } from "@/recoil-state/battle_lobby";
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom";
import { playerDecksAtom } from "@/recoil-state/player_decks/player_decks.atom";
import { playerCardsAtom } from "@/recoil-state/player_cards/player_cards.atom";
import { coinflip } from "@/utils/functions/coinflip";
import { battleAtom, useBattleActions } from "@/recoil-state/battle";
import { pickRandomCardFromBattleDeck } from "@/utils/functions/gameplay_mechanics";
import { usePlayerDecksActions } from "@/recoil-state/player_decks/player_decks.actions";
import { Opponent, OriginalCard } from "@/utils";
import HeroComponent from "./components/hero_component";
import { Hero } from "@/utils/types/hero";
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions";
import WinnerComponent from "./components/winner_component";
import LooserComponent from "./components/looser_component";
import powerRegistry from "arcane-blessings";
import { arcaneAffinity, arcaneMastery, divineFury, divineShield, dragonBreath, frostNova, infernalRage, lycanthropy, ressurect, stealth, suddenStrike, thunderStrike, wisdomGaze } from "../../utils/demo_powers";
import { SpecialAttackData } from "../../utils/types/special_attack_data";

import { executePower } from "@/utils/functions/execute_power";
import { EffectType } from "@/utils/types/ab_types";
import { trpc } from "@/utils/trpc";
import { DEMO_PLAYERS, separatePlayersIntoGroups, shuffleArray } from "@/server/helper_functions";

export interface ISocketUser {
    socketId: string;
    walletAddress: string;
    battleDeckAmount: number;
    hero: Hero;
    battleDeckId: string;
    userStats: {
        opponents: {
            [walletAddress: string]: {
                winsAgainst: number
                lossesAgainst: number
                totalGames: number
            }
        },
        totalWins: number
        totalLosses: number
        longestWinStreak: number
        longestLossStreak: number
        currentWinStreak: number
        currentLossStreak: number
        walletAddress: string
    },
}
interface IMyStateToOponent {
    opponent: {
        socketId: string,
        walletAddress: string,
        battleDeckAmount: number,
        playableCardsAmount: number,
        cardsOnTheTable: OriginalCard[],
        activeCard?: OriginalCard,
        totalMana: number,
        availableMana: number,
        hero?: Hero,
        deckId?: string
    },
    to: string
}

export default function BattlePage() {
    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);

    const getUserStats = trpc.getUserStats.useQuery({ walletAddress: user?.walletAddress ?? '' });
    const router = useRouter()
    const connectToLobby = trpc.connectToLobby.useMutation();
    const saveGameStats = trpc.saveGameStats.useMutation();
    const saveUserStats = trpc.saveUserStats.useMutation();
    const battleLobbyState = useRecoilValue(battleLobbyAtom);
    const playerDecksState = useRecoilValue(playerDecksAtom);
    const playerCardsState = useRecoilValue(playerCardsAtom);
    const battleLobbyActions = useBattleLobbyActions();
    const battleActions = useBattleActions();
    const playerDecksActions = usePlayerDecksActions();
    const battleState = useRecoilValue(battleAtom);
    const errorSuccessActions = useErrorSuccessActions();
    const globalModalActions = useGlobalModalActions();

    useEffect(() => {
        if (user && playerDecksState.battleDeck.length === 30 && getUserStats.isFetched) {
            handleConnect(user)
        } else {
            router.push('/')
        }
        return () => {
            socket.disconnect();
        }
    }, [user, playerDecksState.battleDeck])

    useEffect(() => {
        if (battleState.myTurn) {
            refilMana()
            selectPlayCard()
        }
    }, [battleState.myTurn])

    useEffect(() => { }, [battleState.playerPlayableCards])
    useEffect(() => { }, [battleState.opponent])
    useEffect(() => { }, [battleState.availableMana])
    useEffect(() => { }, [battleState.totalMana])
    useEffect(() => { }, [battleState.activeCard])
    useEffect(() => { }, [battleState.cardsHaveAttacked])

    const refilMana = async () => {
        battleActions.refilManna()
        const data: IMyStateToOponent = {
            opponent: {
                socketId: battleState.mySocketId ?? '',
                walletAddress: user?.walletAddress ?? '',
                battleDeckAmount: battleState.activeBattleDeck.length,
                playableCardsAmount: battleState.playerPlayableCards.length,
                cardsOnTheTable: battleState.playerCardsOnTable,
                activeCard: battleState.activeCard,
                totalMana: battleState.totalMana,
                availableMana: battleState.availableMana,
                hero: battleState.hero,
                deckId: battleState.deckId
            },
            to: battleState.opponent?.socketId ?? ''
        }
        socket.emit("set_opponent_statee", data)
    }

    const selectPlayCard = () => {
        const battleDeck: OriginalCard[] = JSON.parse(JSON.stringify(battleState.activeBattleDeck));
        const randomCardRes = pickRandomCardFromBattleDeck(battleDeck);
        const playerPlayableCards: OriginalCard[] = JSON.parse(JSON.stringify(battleState.playerPlayableCards));
        battleDeck.splice(randomCardRes.index, 1);
        if (playerPlayableCards.length > 9) {
            return;
        }
        playerPlayableCards.push(randomCardRes.randomCard);
        battleActions.setActiveBattleDeck(battleDeck);
        battleActions.setPlayerPlayableCards(playerPlayableCards);
        const data: IMyStateToOponent = {
            opponent: {
                socketId: battleState.mySocketId ?? '',
                walletAddress: user?.walletAddress ?? '',
                battleDeckAmount: battleDeck.length,
                playableCardsAmount: playerPlayableCards.length,
                cardsOnTheTable: battleState.playerCardsOnTable,
                activeCard: battleState.activeCard,
                totalMana: battleState.totalMana,
                availableMana: battleState.availableMana,
                hero: battleState.hero,
                deckId: battleState.deckId
            },
            to: battleState.opponent?.socketId ?? ''
        }
        socket.emit("set_opponent_state", data)
    }

    const handleConnect = async (user: UserDocument) => {
        const walletAddress = user.walletAddress
        const battleDeckAmount = playerDecksState.battleDeck.length
        const battleDeckId = battleState.deckId
        const userStats = getUserStats.data
        const hero: Hero = {
            image: user.profilePicture ?? '',
            health: 30
        }
        socket.auth = { walletAddress, battleDeckAmount, hero, battleDeckId, userStats };
        socket.connect();
    }

    const deactivateCard = () => {
        battleActions.setActiveCard(undefined)
        const data: IMyStateToOponent = {
            opponent: {
                socketId: battleState.mySocketId ?? '',
                walletAddress: user?.walletAddress ?? '',
                battleDeckAmount: battleState.activeBattleDeck.length,
                playableCardsAmount: battleState.playerPlayableCards.length,
                cardsOnTheTable: battleState.playerCardsOnTable,
                activeCard: undefined,
                totalMana: battleState.totalMana,
                availableMana: battleState.availableMana,
                hero: battleState.hero,
                deckId: battleState.deckId
            },
            to: battleState.opponent?.socketId ?? ''
        }
        socket.emit("set_opponent_state", data)
    }

    const flipTurn = () => {
        if (!battleState.myTurn) {
            return;
        }

        deactivateCard()
        socket.emit("flip_turn")
    }

    const placeOnBoard = (card: OriginalCard) => {
        if (!battleState.myTurn || battleState.havePlacedOnBoard || battleState.haveAttacked) {
            return;
        }
        battleActions.setHavePlacedOnBoard(true);
        const currentPlayerCardsOnTable: OriginalCard[] = JSON.parse(JSON.stringify(battleState.playerCardsOnTable));
        if (currentPlayerCardsOnTable.length === 7) {
            return;
        }
        deactivateCard()

        const playerPlayableCards: OriginalCard[] = JSON.parse(JSON.stringify(battleState.playerPlayableCards));
        const cardIdx = playerPlayableCards.findIndex((playableCard) => playableCard.token_id === card.token_id)

        currentPlayerCardsOnTable.push(card)
        playerPlayableCards.splice(cardIdx, 1)

        battleActions.setPlayerPlayableCards(playerPlayableCards)


        const specialPowerData: SpecialAttackData = {
            attackingCard: card,
            attackerCardsOnBoard: currentPlayerCardsOnTable,
            attackerCardsInHand: playerPlayableCards,
            attackerDeck: battleState.activeBattleDeck,
            attackerDiscardedCards: [],
            attackerHero: battleState.hero as any,
            attackedCard: card,
            opponentCardsOnBoard: battleState.opponent?.cardsOnTheTable ?? [],
            opponentCardInHand: [],
            opponentDeck: [],
            opponentDiscardedCards: [],
            opponentHero: battleState.opponent?.hero as any,
            lingerEffect: []
        }

        const executedPower = executePower(EffectType.ON_CARD_PLACEMENT, specialPowerData, card);
        finalizeExecution(executedPower, currentPlayerCardsOnTable)

        const data: IMyStateToOponent = {
            opponent: {
                socketId: battleState.mySocketId ?? '',
                walletAddress: user?.walletAddress ?? '',
                battleDeckAmount: executedPower ? executedPower.attackerDeck.length : battleState.activeBattleDeck.length,
                playableCardsAmount: executedPower ? executedPower.attackerCardsInHand.length : playerPlayableCards.length,
                cardsOnTheTable: executedPower ? executedPower.attackerCardsOnBoard : currentPlayerCardsOnTable,
                activeCard: undefined,
                totalMana: battleState.totalMana,
                availableMana: battleState.availableMana,
                hero: battleState.hero,
                deckId: battleState.deckId
            },
            to: battleState.opponent?.socketId ?? ''
        }
        socket.emit("set_opponent_state", data)
    }

    const activateCard = (card: OriginalCard) => {
        if (!battleState.myTurn || battleState.havePlacedOnBoard) {
            return;
        }
        battleActions.setActiveCard(card)
        const data: IMyStateToOponent = {
            opponent: {
                socketId: battleState.mySocketId ?? '',
                walletAddress: user?.walletAddress ?? '',
                battleDeckAmount: battleState.activeBattleDeck.length,
                playableCardsAmount: battleState.playerPlayableCards.length,
                cardsOnTheTable: battleState.playerCardsOnTable,
                activeCard: card,
                totalMana: battleState.totalMana,
                availableMana: battleState.availableMana,
                hero: battleState.hero,
                deckId: battleState.deckId
            },
            to: battleState.opponent?.socketId ?? ''
        }
        socket.emit("set_opponent_state", data)
    }
    const isActivePlayerCard = (card: OriginalCard) => {
        return card.token_id === battleState.activeCard?.token_id
    }
    const isActiveOpponentCard = (card: OriginalCard) => {
        return card.token_id === battleState.opponent?.activeCard?.token_id;
    }


    const takeMana = (card: OriginalCard) => {
        const cardManaCost = card.metadata.manaCost ?? 0;
        const currentMana = battleState.availableMana - cardManaCost
        battleActions.setAvailableMana(currentMana)
    }
    const hasEnoughMana = (card: OriginalCard) => {
        const cardManaCost = card.metadata.manaCost ?? 0;
        return battleState.availableMana >= cardManaCost
    }
    const isCardDead = (card: OriginalCard) => {
        return card.metadata.health <= 0
    }
    const damageCard = (card: OriginalCard, discard?: boolean) => {
        const opponent: Opponent = JSON.parse(JSON.stringify(battleState.opponent))
        const cardIdx = opponent.cardsOnTheTable.findIndex((cardOnTheTable) => cardOnTheTable.token_id === card.token_id)
        if (discard) {
            opponent.cardsOnTheTable.splice(cardIdx, 1)
        } else {
            opponent.cardsOnTheTable[cardIdx] = card
        }
        battleActions.setOpponent(opponent)
        socket.emit("damaged_cards_on_the_table", {
            damagedCardsOnTheTable: opponent.cardsOnTheTable,
            to: battleState.opponent?.socketId ?? ''
        })
    }
    const attack = (opponentCard: OriginalCard) => {
        if (!battleState.activeCard || hasEnoughMana(battleState.activeCard) === false || battleState.cardsHaveAttacked.includes(battleState.activeCard.token_id ?? '')) {
            return;
        }

        const specialPowerData: SpecialAttackData = {
            attackingCard: battleState.activeCard,
            attackerCardsOnBoard: battleState.playerCardsOnTable,
            attackerCardsInHand: battleState.playerPlayableCards,
            attackerDeck: battleState.activeBattleDeck,
            attackerDiscardedCards: [],
            attackerHero: battleState.hero as any,
            attackedCard: opponentCard,
            opponentCardsOnBoard: battleState.opponent?.cardsOnTheTable ?? [],
            opponentCardInHand: [],
            opponentDeck: [],
            opponentDiscardedCards: [],
            opponentHero: battleState.opponent?.hero as any,
            lingerEffect: []
        }

        const executedPower = executePower(EffectType.AFTER_BASIC_ATTACK, specialPowerData, battleState.activeCard);
        finalizeExecution(executedPower, battleState.playerCardsOnTable)

        const damagedCard: OriginalCard = JSON.parse(JSON.stringify(opponentCard))
        damagedCard.metadata.health -= battleState.activeCard?.metadata.attackPower;
        if (isCardDead(damagedCard)) {
            damageCard(damagedCard, true)
        } else {
            damageCard(damagedCard, false)
            shouldExecute(EffectType.AFTER_OPPONENT_BASIC_ATTACK, executedPower ? executedPower : specialPowerData, damagedCard, battleState.playerCardsOnTable)
        }
        deactivateCard()
        takeMana(battleState.activeCard)
        battleActions.setCardsHaveAttacked(battleState.activeCard.token_id ?? '')
        battleActions.setHaveAttacked(true)
    }

    const isHeroDead = (hero: Hero) => {
        return hero.health <= 0
    }
    const damageHero = async (hero: Hero, defeat?: boolean) => {
        const opponent: Opponent = JSON.parse(JSON.stringify(battleState.opponent))
        if (defeat) {
            await saveGameStats.mutateAsync({
                players: {
                    winner: user?.walletAddress ?? '',
                    looser: opponent.walletAddress
                },
                decks: {
                    winner: battleState.deckId ?? '',
                    looser: opponent.deckId ?? ''
                },
                game: 'FINISHED'
            })

            await saveUserStats.mutateAsync({
                walletAddress: user?.walletAddress ?? '',
                opponentWalletAddress: opponent.walletAddress,
                hasWon: true
            })

            await saveUserStats.mutateAsync({
                walletAddress: opponent.walletAddress,
                opponentWalletAddress: user?.walletAddress ?? '',
                hasWon: false
            })
            globalModalActions.openGlobalModal(<WinnerComponent />)
            socket.emit("defeated", {
                to: battleState.opponent?.socketId ?? ''
            })
            battleActions.setMyTurn(false)
            return
        }
        opponent.hero = hero
        battleActions.setOpponent(opponent)
        socket.emit("damaged_hero", {
            damagedHero: hero,
            to: battleState.opponent?.socketId ?? ''
        })
    }
    const attackHero = () => {
        const areCardOnTheTable = battleState.opponent?.cardsOnTheTable ?? [];
        if (
            !battleState.activeCard ||
            hasEnoughMana(battleState.activeCard) === false ||
            battleState.cardsHaveAttacked.includes(battleState.activeCard.token_id ?? '') ||
            areCardOnTheTable.length > 0
        ) {
            return;
        }
        const damagedOpponentHero: Hero = JSON.parse(JSON.stringify(battleState.opponent?.hero))
        damagedOpponentHero.health -= battleState.activeCard?.metadata.attackPower;
        if (isHeroDead(damagedOpponentHero)) {
            damageHero(damagedOpponentHero, true)
        } else {
            damageHero(damagedOpponentHero, false)
        }
        deactivateCard()
        takeMana(battleState.activeCard)
        battleActions.setCardsHaveAttacked(battleState.activeCard.token_id ?? '')
        battleActions.setHaveAttacked(true)
    }

    const shouldExecute = (move: EffectType, specialAttackData: SpecialAttackData, executingCard: OriginalCard, playerCardsOnTable: OriginalCard[]) => {
        if (executingCard.metadata.special) {
            const executedPower = executePower(move, specialAttackData, executingCard)
            finalizeExecution(executedPower, playerCardsOnTable)
        }
    }

    const finalizeExecution = (executedPower: SpecialAttackData | undefined, currentPlayerCardsOnTable: OriginalCard[]) => {
        if (executedPower) {
            console.log('executedPower: ', executedPower)
            battleActions.setPlayerCardsOnTable(executedPower.attackerCardsOnBoard)
            battleActions.setPlayerPlayableCards(executedPower.attackerCardsInHand)
            battleActions.setActiveBattleDeck(executedPower.attackerDeck)
            battleActions.setHero({
                image: battleState.hero?.image ?? '',
                health: executedPower.attackerHero.health
            })
            socket.emit("damaged_cards_on_the_table", {
                damagedCardsOnTheTable: executedPower.opponentCardsOnBoard,
                to: battleState.opponent?.socketId ?? ''
            })
            socket.emit("damaged_hero", {
                damagedHero: {
                    image: battleState.opponent?.hero?.image ?? '',
                    health: executedPower.opponentHero.health
                },
                to: battleState.opponent?.socketId ?? ''
            })
        } else {
            battleActions.setPlayerCardsOnTable(currentPlayerCardsOnTable)
        }
    }

    socket.on("users", (users: ISocketUser[]) => {
        if (users.length > 1) {
            const shuffled = shuffleArray([...users])
            const groups = separatePlayersIntoGroups(shuffled, 30)

            groups.forEach((group) => {
                const players = {
                    player1: group[0],
                    player2: group[1]
                }
                socket.emit('join_battle_room', players);
            })
        }
    });

    socket.on("battle_start", (data) => {
        const opponent = data.opponent
        battleActions.setHero({
            image: user?.profilePicture ?? '',
            health: 30
        })
        battleActions.setOpponent(opponent)
        battleActions.setMyTurn(data.myTurn)
        battleActions.setMySocketId(data.mySocketId)
    })

    socket.on("user_connected", (user) => {
        battleLobbyActions.setSocketId(user.socketId)
    });

    socket.on("user_already_connected", (user) => {
        errorSuccessActions.openErrorSuccess('User already connected to a lobby!')
        router.push('/')
    });

    socket.on("flip_turn", () => {
        console.log('battleState.myturn: ', battleState.myTurn)
        if (battleState.myTurn) {
            battleActions.setHavePlacedOnBoard(true);
            battleActions.setHaveAttacked(true);
            // shouldExecute(EffectType.AFTER_END_TURN) --> For further analysis
        } else {
            battleActions.setHavePlacedOnBoard(false);
            battleActions.setHaveAttacked(false);
            battleActions.resetCardsHaveAttacked();
            // shouldExecute(EffectType.AFTER_OPPONENT_END_TURN) --> For further analysis
        }
        battleActions.setMyTurn(!battleState.myTurn)
    })

    socket.on("set_opponent_state", (opponent) => {
        battleActions.setOpponent(opponent)
    })

    socket.on("damaged_cards_on_the_table", (damagedCardsOnTheTable) => {
        battleActions.setPlayerCardsOnTable(damagedCardsOnTheTable)
    })

    socket.on("damaged_hero", (damagedHero) => {
        battleActions.setHero(damagedHero)
    })

    socket.on("defeated", async () => {
        globalModalActions.openGlobalModal(<LooserComponent />)
        battleActions.setMyTurn(false)
    })

    return <AuthGuard>
        <div className="grid w-screen h-screen grid-cols-12 p-3 bg-primary-400">
            <div className="flex flex-col items-center justify-between col-span-1">
                <div className="flex items-center justify-center space-x-0.5">
                    {Array.from({ length: battleState.opponent?.battleDeckAmount || 0 }, (_, index) => {
                        return <div className="h-20 shadow-lg w-0.5 border border-secondary-400" key={index}></div>
                    })}
                </div>
                {battleState.hero ? <HeroComponent hero={battleState.hero} /> : <></>}
            </div>
            <div className="flex flex-col items-center justify-between h-full col-span-10">
                <div>
                    <div className="flex items-center justify-start space-y-3">
                        <div>
                            <p className="flex whitespace-nowrap">{battleState.opponent?.availableMana} / {battleState.opponent?.totalMana}</p>
                        </div>
                        <div className="flex items-center justify-center space-x-3">
                            <div className="flex items-center justify-center space-x-1 grow">
                                {Array.from({ length: battleState.opponent?.playableCardsAmount || 0 }, (_, index) => {
                                    return <div key={index} className="space-y-3 border border-black rounded-md">
                                        <img src='/crypties_logo_original.png' className="rounded-md w-28 h-28" />
                                    </div>
                                })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                        {battleState.opponent?.cardsOnTheTable?.map((card, index) => {
                            return <div key={index} onClick={() => attack(card)} className={`${isActiveOpponentCard(card) ? 'shadow-lg border-secondary-400' : 'border-black'} cursor-pointer p-3 rounded-md border space-y-3`}>
                                <img src={card.image_url} className="rounded-md w-28 h-28" />
                                <div>
                                    {/* <p>{card.name}</p> */}
                                    <p>Attack: {card.metadata.attackPower}</p>
                                    <p>Health: {card.metadata.health}</p>
                                    <p>Mana: {card.metadata.manaCost}</p>
                                    {card.metadata.special ? <p className="text-xs">Power: {card.metadata.special} {card.specialPowerUsed ?? 0}</p> : <></>}
                                </div>
                            </div>
                        })}
                    </div>
                </div>

                <div className="items-center justify-center space-y-3">
                    <div className="flex items-center justify-center space-x-3">
                        {battleState.playerCardsOnTable.map((card, index) => {
                            return <div key={index} onClick={() => activateCard(card)} className={`${isActivePlayerCard(card) ? 'shadow-lg border-secondary-400' : 'border-black'} cursor-pointer p-3 rounded-md border space-y-3`}>
                                <img src={card.image_url} className="rounded-md w-28 h-28" />
                                <div>
                                    {/* <p>{card.name}</p> */}
                                    <p>Attack: {card.metadata.attackPower}</p>
                                    <p>Health: {card.metadata.health}</p>
                                    <p>Mana: {card.metadata.manaCost}</p>
                                    {card.metadata.special ? <p className="text-xs">Power: {card.metadata.special} {card.specialPowerUsed ?? 0}</p> : <></>}
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                        <div className="flex items-center justify-center space-x-1 grow">
                            {battleState.playerPlayableCards.map((card, index) => {
                                if (card) {
                                    return <div onClick={() => placeOnBoard(card)} key={index} className={`${battleState.myTurn ? 'cursor-pointer' : ''} p-3 rounded-md border border-black space-y-3`}>
                                        <img src={card.image_url} className="rounded-md w-28 h-28" />
                                        <div>
                                            {/* <p>{card.name}</p> */}
                                            <p>Attack: {card.metadata.attackPower}</p>
                                            <p>Health: {card.metadata.health}</p>
                                            <p>Mana: {card.metadata.manaCost}</p>
                                            {card.metadata.special ? <p className="text-xs">Power: {card.metadata.special} {card.specialPowerUsed ?? 0}</p> : <></>}
                                        </div>
                                    </div>
                                }
                            })
                            }
                        </div>
                        <div>
                            <p className="flex whitespace-nowrap">{battleState.availableMana} / {battleState.totalMana}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center justify-between col-span-1">
                {battleState.opponent?.hero ? <div className={`${battleState.activeCard ? 'cursor-pointer' : ''}`} onClick={attackHero}><HeroComponent hero={battleState.opponent?.hero} /></div> : <></>}
                <div className={`${battleState.myTurn ? 'opacity-100 cursor-pointer' : 'opacity-50'} p-3 border border-secondary-400 rounded-full flex items-center justify-center text-center text-black bg-secondary-400`} onClick={flipTurn}>End turn</div>
                <div className="flex items-center justify-center space-x-0.5">
                    {battleState.activeBattleDeck.map((card, index) => <div className="h-20 shadow-lg w-0.5 border border-secondary-400" key={index}></div>)}
                </div>
            </div>
        </div>
    </AuthGuard>
}