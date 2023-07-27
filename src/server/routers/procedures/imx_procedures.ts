import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { Link } from '@imtbl/imx-sdk';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { waitForTransaction } from '@/server/helper_functions';
import { Wallet } from '@ethersproject/wallet';
import { AlchemyProvider } from '@ethersproject/providers';

const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 ?? ''
const ETH_NETWORK = process.env.ETH_NETWORK ?? 'goerli';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';

const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

const IMX_COLLECTION_ADDRESS = process.env.IMX_COLLECTION_ADDRESS ?? '';

export const setupWallet = procedure
  .input(
    z.object({
      imxLink: z.custom((val) => {
        if (val instanceof Link) {
          return val;
        } else {
          throw new Error('Invalid Link type');
        }
      })
    })
  )
  .mutation(async (opts) => {
    const imxLink = opts.input.imxLink as Link
    const { address, starkPublicKey } = await imxLink.setup({});
    localStorage.setItem('WALLET_ADDRESS', address);
    localStorage.setItem('STARK_PUBLIC_KEY', starkPublicKey);
  })

export const getUserCards = procedure
  .input(
    z.object({
      walletAddress: z.string()
    })
  )
  .mutation(async (opts) => {
    const inputs = opts.input;
    const client = {
      publicApiUrl: process.env.NEXT_PUBLIC_IMX_API_ADDRESS ?? '',
      starkContractAddress: process.env.STARK_CONTRACT_ADDRESS ?? '',
      registrationContractAddress: process.env.REGISTRATION_ADDRESS,
      gasLimit: process.env.GAS_LIMIT,
      gasPrice: process.env.GAS_PRICE,
    }
    const minter = await ImmutableXClient.build({
      ...client,
      signer: new Wallet(PRIVATE_KEY1).connect(provider),
    });

    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    console.log('registerImxResult: ', registerImxResult.tx_hash)

    if (registerImxResult.tx_hash === '') {
      console.log('Minter registered, continuing...');
    } else {
      console.log('Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const assets = await minter.getAssets({
      user: inputs.walletAddress,
      collection: IMX_COLLECTION_ADDRESS
    })
    return assets;
  })