import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  sepolia,
  metis,
  baseSepolia,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'AIRA',
  projectId: '7c7379cff204bb71180baaa9c14fc930',
  chains: [mainnet, sepolia, metis, baseSepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});