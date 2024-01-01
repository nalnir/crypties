const nodeFetch = require('node-fetch');
import { ISocketUser } from '@/pages/battle';
import { Hero } from '@/utils/types/hero';
import { AlchemyProvider, JsonRpcProvider } from '@ethersproject/providers';
import { faker } from '@faker-js/faker';

const ETH_NETWORK = process.env.ETH_NETWORK ?? 'sepolia'
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? ''
// const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);
const provider = new JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  {
    name: 'sepolia',
    chainId: 11155111,
  },
);

export async function downloadImageAsBuffer(url: string) {
  try {
    const response = await nodeFetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error) {
    console.error('Error downloading the image:', error);
    return null;
  }
}

export function bufferToBlob(buffer: Buffer, mimeType: string): Blob {
  return new Blob([buffer], { type: mimeType });
}

export const waitForTransaction = async (promise: Promise<string>) => {
  const txId = await promise;
  console.log('Waiting for transaction', {
    txId,
    etherscanLink: `https://sepolia.etherscan.io/tx/${txId}`,
    alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-sepolia/tx/${txId}`,
  });
  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error('Transaction rejected');
  }
  console.log(`Transaction Mined: ${receipt.blockNumber}`);
  return receipt;
};

const ethereumAddresses = Array(10).fill(null).map(() => faker.finance.ethereumAddress());
export function createRandomPlayer(): ISocketUser {
  const randomEthereumAddress = faker.helpers.arrayElements(ethereumAddresses);
  const playerAddress = randomEthereumAddress[Math.floor(Math.random() * randomEthereumAddress.length)];

  return {
    socketId: faker.string.uuid(),
    walletAddress: playerAddress,
    battleDeckAmount: 30,
    battleDeckId: faker.string.uuid(),
    userStats: {
      opponents: randomEthereumAddress.filter((val) => val !== playerAddress).reduce((opp: any, address: any) => {
        opp[address] = {
          winsAgainst: faker.number.int({ min: 0, max: 100 }),
          lossesAgainst: faker.number.int({ min: 0, max: 100 }),
          totalGames: faker.number.int({ min: 0, max: 100 })
        };
        return opp;
      }, {}),
      totalWins: faker.number.int({ min: 0, max: 100 }),
      totalLosses: faker.number.int({ min: 0, max: 100 }),
      longestWinStreak: faker.number.int({ min: 0, max: 100 }),
      longestLossStreak: faker.number.int({ min: 0, max: 100 }),
      currentWinStreak: faker.number.int({ min: 0, max: 100 }),
      currentLossStreak: faker.number.int({ min: 0, max: 100 }),
      walletAddress: playerAddress,
    },
    hero: {
      image: faker.image.avatar(),
      health: 30
    },
  };
}

export const DEMO_PLAYERS: ISocketUser[] = faker.helpers.multiple(createRandomPlayer, {
  count: 200,
});

// export const separatePlayersIntoGroups = (players: ISocketUser[], groupSize: number) => {
//   var result = [];
//   while (players.length > groupSize) {
//     const group = players.splice(0, groupSize);
//     console.log('group', group)
//     const matchedPair = matchPlayersInGroup(group);
//     console.log('matchedPair', matchedPair);
//     result.push(group);
//   }
//   if (players.length > 0) {
//     result.push(players);
//   }
//   return result;
// }

export const separatePlayersIntoGroups = (players: ISocketUser[], groupSize: number) => {
  var result = [];
  while (players.length >= groupSize) {
    const group = players.splice(0, groupSize);
    const matchedPairs = matchPlayersInGroup(group);
    result.push(...matchedPairs);
  }
  if (players.length > 1) {
    const remainingPairs = matchPlayersInGroup(players);
    result.push(...remainingPairs);
  }
  return result;
}

export const shuffleArray = (array: ISocketUser[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

export function matchPlayersInGroup(group: ISocketUser[]): [ISocketUser, ISocketUser][] {
  // Create an array of all possible pairs of players
  let pairs: [ISocketUser, ISocketUser][] = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      pairs.push([group[i], group[j]]);
    }
  }

  // Calculate a score for each pair and sort the pairs by their score
  pairs.sort(([playerA1, playerA2], [playerB1, playerB2]) => {
    const scoreA = 1 / (playerA1.userStats.opponents[playerA2.walletAddress]?.totalGames || 1) + playerA1.userStats.currentWinStreak + playerA1.userStats.currentLossStreak + (playerA1.userStats.totalWins - playerA1.userStats.totalLosses);
    const scoreB = 1 / (playerB1.userStats.opponents[playerB2.walletAddress]?.totalGames || 1) + playerB1.userStats.currentWinStreak + playerB1.userStats.currentLossStreak + (playerB1.userStats.totalWins - playerB1.userStats.totalLosses);
    return scoreB - scoreA;
  });

  // Match the pairs with the highest scores
  const matches = [];
  while (pairs.length > 0) {
    const pair = pairs.shift();
    if (pair) {
      const [player1, player2] = pair;
      matches.push([player1, player2]);
      pairs = pairs.filter(pair => !pair.includes(player1) && !pair.includes(player2));
    }
  }

  return matches as [ISocketUser, ISocketUser][];
}
