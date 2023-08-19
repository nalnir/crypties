import { z } from 'zod';
import { procedure } from '@/server/trpc';


export const getETHprice = procedure
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