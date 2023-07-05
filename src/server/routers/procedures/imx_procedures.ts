import { z } from 'zod';
import { procedure } from '@/server/trpc';
import { Link } from '@imtbl/imx-sdk';

type ImxLinkInput = {
  imxLink: Link;
};

export const setupWallet = procedure
    .input(
      z.object({
        imxLink: z.custom((val) => {
          if(val instanceof Link) {
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