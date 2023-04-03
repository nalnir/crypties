import { PlayingCardModel } from "../mocks/player_deck";

export function handleAttackTargetCard(
    targetCard: PlayingCardModel | null,
    playerCard: PlayingCardModel | null,
) {
    if (targetCard && playerCard) {
        const newCard: PlayingCardModel = JSON.parse(JSON.stringify(targetCard));

        const damage = targetCard?.health - playerCard?.attackPower
        newCard.health = damage

        return newCard
    }
}

export function handleKillCard(targetCard: PlayingCardModel | null, enemyCardsOnBoard: PlayingCardModel[], enemyTotalCards: PlayingCardModel[]): { enemyCardsOnBoard: PlayingCardModel[], enemyTotalCards: PlayingCardModel[] } | undefined {
    if (targetCard && enemyCardsOnBoard && enemyTotalCards) {
        const newEnemyCardsOnBoard = enemyCardsOnBoard.filter((card) => card.id !== targetCard.id)
        const newEnemyTotalCards = enemyTotalCards.filter((card) => card.id !== targetCard.id)

        //Filtering cards from total card deck to not include cards on the board
        const filtered = newEnemyTotalCards.filter(card1 => !newEnemyCardsOnBoard.some(card2 => card1.id === card2.id));
        const newRandomCard = pickRandomCard(filtered)

        if (!newRandomCard) {
            return {
                enemyCardsOnBoard: newEnemyCardsOnBoard,
                enemyTotalCards: newEnemyTotalCards
            };
        }

        newEnemyCardsOnBoard.push(newRandomCard);
        return {
            enemyCardsOnBoard: newEnemyCardsOnBoard,
            enemyTotalCards: newEnemyTotalCards
        }
    }
    return;
}

export function pickRandomCard(deck: PlayingCardModel[]): PlayingCardModel {
    const randomIndex = Math.floor(Math.random() * deck.length);
    return deck[randomIndex];
}

export function pickFirstFiveCards<PlayingCardModel>(objects: PlayingCardModel[]): PlayingCardModel[] {
    const pickedCards: PlayingCardModel[] = [];

    // Select 5 random cards
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * objects.length);
        const randomCard = objects[randomIndex];

        // Avoid duplicates
        if (!pickedCards.includes(randomCard)) {
            pickedCards.push(randomCard);
        } else {
            i--; // Try again
        }
    }

    return pickedCards;
}

export function handleGameOver() {
    prompt('GAME OVER BITCH!!!')
}