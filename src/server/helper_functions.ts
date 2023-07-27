const nodeFetch = require('node-fetch');
import { AlchemyProvider } from '@ethersproject/providers';

const ETH_NETWORK = process.env.ETH_NETWORK ?? 'goerli'
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? ''
const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

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
    etherscanLink: `https://goerli.etherscan.io/tx/${txId}`,
    alchemyLink: `https://dashboard.alchemyapi.io/mempool/eth-goerli/tx/${txId}`,
  });
  const receipt = await provider.waitForTransaction(txId);
  if (receipt.status === 0) {
    throw new Error('Transaction rejected');
  }
  console.log(`Transaction Mined: ${receipt.blockNumber}`);
  return receipt;
};
