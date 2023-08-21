import { connectDB } from "@/backend/connection";
import { procedure } from "@/server/trpc";
import { z } from "zod";

import { NFTStorage, File } from 'nft.storage';
import { Wallet } from '@ethersproject/wallet';
import { AlchemyProvider } from '@ethersproject/providers';

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_API_KEY ?? ''
const ETH_NETWORK = process.env.ETH_NETWORK ?? 'goerli';
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 ?? '';
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS ?? '';

import AWS from 'aws-sdk';
import { original_card } from "../objects";
import { ImmutableMethodParams, ImmutableXClient } from "@imtbl/imx-sdk";
import Generation, { GenerationDocument } from "@/pages/api/schemas/generation_schema";
import { waitForTransaction } from "@/server/helper_functions";

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const provider = new AlchemyProvider(ETH_NETWORK, ALCHEMY_API_KEY);

const bucketName = process.env.AWS_BUCKET_NAME
const s3 = new AWS.S3();

export const uploadMetadataToIPFS = procedure
    .input(original_card)
    .mutation(async (opts) => {
        if (!NFT_STORAGE_KEY) {
            throw new Error("NFT_STORAGE_KEY Undefined")
        }
        const inputs = opts.input;

        const jsonStr = JSON.stringify(inputs);
        const jsonFile = new File([jsonStr], 'card_data.json', { type: 'application/json' });

        const storage = new NFTStorage({ token: NFT_STORAGE_KEY })

        const cid = await storage.storeBlob(jsonFile)
        console.log({ cid })
        return cid;
    })

export const uploadMetadataToS3 = procedure
    .input(z.object({
        original_card,
        tokenId: z.number()
    }))
    .mutation(async (opts) => {
        if (!NFT_STORAGE_KEY) {
            throw new Error("NFT_STORAGE_KEY Undefined")
        }

        if (!bucketName) {
            throw new Error("Bucket name undefined")
        }

        const inputs = opts.input;
        const db = await connectDB();

        const jsonStr = JSON.stringify(inputs.original_card);
        const bufferData = Buffer.from(jsonStr, 'utf-8');

        const params: AWS.S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: inputs.tokenId.toString(),
            Body: bufferData,
            ContentType: 'application/json'
        };

        try {
            await s3.putObject(params).promise();
            console.log('File uploaded successfully.');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    })

export const getTokenId = procedure
    .input(z.object({
        generation: z.number()
    }))
    .query(async (opts) => {
        return await Generation.findOne({
            generation: opts.input.generation,
        });
    })

export const bumpTokenId = procedure
    .input(z.object({
        generation: z.number(),
    }))
    .mutation(async (opts) => {
        const inputs = opts.input;
        return await Generation.findOneAndUpdate({ generation: inputs.generation }, {
            $inc: { amountOfCardsForged: 1 }
        }, { new: true });
    })

export const mintBulk = procedure
    .input(z.object({
        number_of_tokens_to_mint: z.number().default(1),
        walletAddress: z.string(),
        tokenId: z.number(),
    }))
    .mutation(async (opts) => {
        const inputs = opts.input;
        const max_tokens_to_mint = process.env.BULK_MINT_MAX ?? '50';

        if (inputs.number_of_tokens_to_mint >= Number(max_tokens_to_mint)) {
            throw new Error(`Tried to mint too many tokens. Maximum ${max_tokens_to_mint}`);
        }

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

        // minter.getAssets({
        //     user: ""
        // })

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

        const payload: ImmutableMethodParams.ImmutableOffchainMintV2ParamsTS = [
            {
                contractAddress: TOKEN_ADDRESS, // NOTE: a mintable token contract is not the same as regular erc token contract
                users: [
                    {
                        etherKey: inputs.walletAddress.toLowerCase(),
                        tokens: [{
                            id: inputs.tokenId.toString(),
                            blueprint: 'onchain-metadata'
                        }]
                    },
                ],
            },
        ];

        const result = await minter.mintV2(payload);
    })

export const getCurrentGeneration = procedure
    .query(async (): Promise<GenerationDocument | null> => {
        const db = await connectDB();
        return await Generation.findOne({}).sort({ generation: -1 }).limit(1);
    })

export const getCurrentCardId = procedure
    .query(async () => {
        const db = await connectDB();

        const pipeline = [
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amountOfCardsForged' },
                },
            },
        ];

        const result = await Generation.aggregate(pipeline);
        const totalAmount = result[0].totalAmount;
        return totalAmount
    })
