import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

export const otherRouter = createTRPCRouter({
    getETHprice: publicProcedure
        .query(async () => {
            try {
                const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');

                const data = await response.json();
                if (data && data.ethereum && data.ethereum.usd) {
                    return data
                }
                return;
            } catch (error) {
                console.error('Error fetching ETH price');
                return null;
            }
        })
})