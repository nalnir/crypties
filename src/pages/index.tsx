import Head from "next/head"
import Image from 'next/image';
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'

import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, localhost } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MainPage } from './mainPage';
import Web3 from 'web3';
import { RecoilRoot } from 'recoil';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const { chains, provider } = configureChains(
  // [mainnet, polygon, optimism, arbitrum],
  // [
  //   alchemyProvider({ apiKey: process.env.ALCHEMY_ID! }),
  //   publicProvider()
  // ]
  [localhost],
  [jsonRpcProvider({
    rpc: (chain) => ({
      http: "HTTP://127.0.0.1:8545",
    }),
  })]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const inter = Inter({ subsets: ['latin'] })

export default function Landing() {
  return (
    <RecoilRoot>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <MainPage />
        </RainbowKitProvider>
      </WagmiConfig>
    </RecoilRoot>
  )
}

