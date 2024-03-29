import { z } from 'zod';
import { publicProcedure } from '@/server/trpc';
import { Link } from '@imtbl/imx-sdk';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import { waitForTransaction } from '@/server/helper_functions';
import { Wallet } from '@ethersproject/wallet';
import { AlchemyProvider, JsonRpcProvider } from '@ethersproject/providers';
import { ImmutableX, Config, generateStarkPrivateKey, createStarkSigner, UnsignedOrderRequest, WalletConnection } from '@imtbl/core-sdk';
import { ENVIRONMENTS, L1_PROVIDERS, WalletSDK } from '@imtbl/wallet-sdk-web';
import { BigNumber, utils } from 'ethers';


const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 ?? ''
const ETH_NETWORK = process.env.ETH_NETWORK ?? 'sepolia';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';

const IMX_COLLECTION_ADDRESS = process.env.IMX_COLLECTION_ADDRESS ?? '';
const NEXT_PUBLIC_IMX_LINK_ADDRESS = process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS ?? '';

// const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);
const provider = new JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  {
    name: 'sepolia',
    chainId: 11155111,
  },
);
const config = Config.SANDBOX; // Or Config.PRODUCTION
const walletClient = new ImmutableX(config);
const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
const starkSigner = createStarkSigner(starkPrivateKey);

const client = {
  publicApiUrl: process.env.NEXT_PUBLIC_IMX_API_ADDRESS ?? '',
  starkContractAddress: process.env.STARK_CONTRACT_ADDRESS ?? '',
  registrationContractAddress: process.env.REGISTRATION_ADDRESS,
  gasLimit: process.env.GAS_LIMIT,
  gasPrice: process.env.GAS_PRICE,
}

export const setupWallet = publicProcedure
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

export const getUserCards = publicProcedure
  .input(
    z.object({
      walletAddress: z.string()
    })
  )
  .query(async (opts) => {
    const inputs = opts.input;
    const minter = await ImmutableXClient.build({
      ...client,
      signer: new Wallet(PRIVATE_KEY1).connect(provider),
    });

    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash === '') {
      console.log('Minter registered, continuing...');
    } else {
      console.log('Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const starkPrivateKey = generateStarkPrivateKey(); // Or retrieve previously generated key
    const starkSigner = createStarkSigner(starkPrivateKey);

    const assets = await minter.getAssets({
      user: inputs.walletAddress,
      collection: IMX_COLLECTION_ADDRESS,
      sell_orders: true
    })

    return assets;
  })

export const getAllCards = publicProcedure
  .query(async () => {

    const minter = await ImmutableXClient.build({
      ...client,
      signer: new Wallet(PRIVATE_KEY1).connect(provider),
    });

    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash === '') {
      console.log('Minter registered, continuing...');
    } else {
      console.log('Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const assets = await minter.getAssets({
      collection: IMX_COLLECTION_ADDRESS,
      sell_orders: true,
    })

    return assets
  })

export const getUserBalance = publicProcedure
  .input(z.object({
    tokenAddress: z.string().default('eth'),
    walletAddress: z.string()
  }))
  .query(async (opts) => {
    const inputs = opts.input;
    const minter = await ImmutableXClient.build({
      ...client,
      signer: new Wallet(PRIVATE_KEY1).connect(provider),
    });

    const registerImxResult = await minter.registerImx({
      etherKey: minter.address.toLowerCase(),
      starkPublicKey: minter.starkPublicKey,
    });

    if (registerImxResult.tx_hash === '') {
      console.log('Minter registered, continuing...');
    } else {
      console.log('Waiting for minter registration...');
      await waitForTransaction(Promise.resolve(registerImxResult.tx_hash));
    }

    const balance = await minter.getBalance({
      tokenAddress: inputs.tokenAddress,
      user: inputs.walletAddress
    })


    let balance_str = '0';
    if (balance.balance) {
      // const balanceInWei = BigNumber.from(userBalance.data?.balance.hex);
      balance_str = utils.formatUnits(balance.balance, "ether");
    }

    return balance_str
  })

// ORDER PROCEDURES
// export const getOrder = procedure
//   .input(z.object({
//     order_id: z.number()
//   }))
//   .mutation(async () => {

//   })