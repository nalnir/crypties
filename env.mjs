import { z } from 'zod';

/**
 * Specify your server-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars.
 */
const server = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_DATABASE_URL: z.string().min(1),
  AWS_REGION: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_ACCESS_KEY: z.string().min(1),
  AWS_BUCKET_NAME: z.string().min(1),
  RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: z.string().min(1),
  SOCKET_SERVER: z.string().min(1),
  SOCKET_PORT: z.string().min(1),
  PRIVATE_KEY1: z.string().min(1),  
  STARK_CONTRACT_ADDRESS: z.string().min(1),  
  REGISTRATION_ADDRESS: z.string().min(1),  
  TOKEN_ADDRESS: z.string().min(1),  
  GAS_LIMIT: z.string().min(1),  
  GAS_PRICE: z.string().min(1),  
  BULK_MINT_MAX: z.string().min(1),  
  IMX_COLLECTION_ADDRESS: z.string().min(1),  
  OPEN_API_KEY: z.string().min(1),  
  LEONARDO_API_KEY: z.string().min(1),  
  DISCORD_APP_ID: z.string().min(1),  
  DISCORD_API_KEY: z.string().min(1),  
  DISCORD_BOT_TOKEN: z.string().min(1),  
  NFT_STORAGE_API_KEY: z.string().min(1),  
  ALCHEMY_API_KEY: z.string().min(1),  
  ETHERSCAN_API_KEY: z.string().min(1),  
  ETH_NETWORK: z.string().min(1),  
  SUPABASE_JWT_SECRET: z.string().min(1),  
  APP_PEPPER: z.string().min(1),
});

/**
 * Specify your client-side environment variables schema here. This way you can ensure the app isn't
 * built with invalid env vars. To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
const client = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_DECK_AMOUNT_OF_CARDS: z.string(),
  NEXT_PUBLIC_GENERATION: z.string(),
  NEXT_PUBLIC_SUPERADMIN_ADDRESS: z.string(),
  NEXT_PUBLIC_IMX_LINK_ADDRESS: z.string(),
  NEXT_PUBLIC_IMX_API_ADDRESS: z.string()
});

/**
 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
 * middlewares) or client-side so we need to destruct manually.
 *
 * @type {Record<keyof z.infer<typeof server> | keyof z.infer<typeof client>, string | undefined>}
 */
const processEnv = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET,

  AWS_REGION: process.env.AWS_REGION,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,

  RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: process.env.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED,
  NEXT_PUBLIC_DECK_AMOUNT_OF_CARDS: process.env.NEXT_PUBLIC_DECK_AMOUNT_OF_CARDS,
  NEXT_PUBLIC_GENERATION: process.env.NEXT_PUBLIC_GENERATION,
  SOCKET_SERVER: process.env.SOCKET_SERVER,
  SOCKET_PORT: process.env.SOCKET_PORT,

  NEXT_PUBLIC_SUPERADMIN_ADDRESS: process.env.NEXT_PUBLIC_SUPERADMIN_ADDRESS,
  PRIVATE_KEY1: process.env.PRIVATE_KEY1,
  NEXT_PUBLIC_IMX_LINK_ADDRESS: process.env.NEXT_PUBLIC_IMX_LINK_ADDRESS,
  NEXT_PUBLIC_IMX_API_ADDRESS: process.env.NEXT_PUBLIC_IMX_API_ADDRESS,
  STARK_CONTRACT_ADDRESS: process.env.STARK_CONTRACT_ADDRESS,
  REGISTRATION_ADDRESS: process.env.REGISTRATION_ADDRESS,
  TOKEN_ADDRESS: process.env.TOKEN_ADDRESS,
  GAS_LIMIT: process.env.GAS_LIMIT,
  GAS_PRICE: process.env.GAS_PRICE,
  BULK_MINT_MAX: process.env.BULK_MINT_MAX,
  IMX_COLLECTION_ADDRESS: process.env.IMX_COLLECTION_ADDRESS,

  OPEN_API_KEY: process.env.OPEN_API_KEY,
  LEONARDO_API_KEY: process.env.LEONARDO_API_KEY,

  DISCORD_APP_ID: process.env.DISCORD_APP_ID,
  DISCORD_API_KEY: process.env.DISCORD_API_KEY,
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,

  NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY,
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  ETH_NETWORK: process.env.ETH_NETWORK,
  APP_PEPPER: process.env.APP_PEPPER,
};

// Don't touch the part below
// --------------------------

const merged = server.merge(client);

/** @typedef {z.input<typeof merged>} MergedInput */
/** @typedef {z.infer<typeof merged>} MergedOutput */
/** @typedef {z.SafeParseReturnType<MergedInput, MergedOutput>} MergedSafeParseReturn */

let env = /** @type {MergedOutput} */ (process.env);

if (!!process.env.SKIP_ENV_VALIDATION == false) {
  const isServer = typeof window === 'undefined';

  const parsed = /** @type {MergedSafeParseReturn} */ (
    isServer
      ? merged.safeParse(processEnv) // on server we can validate all env vars
      : client.safeParse(processEnv) // on client we can only validate the ones that are exposed
  );
  if (parsed.success === false) {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );
    throw new Error('Invalid environment variables');
  }

  env = new Proxy(parsed.data, {
    get(target, prop) {
      console.log('prop: ', prop)
      console.log('target: ', target)
      if (typeof prop !== 'string') return undefined;
      // Throw a descriptive error if a server-side env var is accessed on the client
      // Otherwise it would just be returning `undefined` and be annoying to debug
      if (!isServer && !prop.startsWith('NEXT_PUBLIC_'))
        throw new Error(
          process.env.NODE_ENV === 'production'
            ? '❌ Attempted to access a server-side environment variable on the client'
            : `❌ Attempted to access server-side environment variable '${prop}' on the client`
        );
      return target[/** @type {keyof typeof target} */ (prop)];
    },
  });
}

export { env };
