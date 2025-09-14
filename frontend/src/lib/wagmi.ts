
import { http, createConfig } from "wagmi";
import { mainnet, sepolia, metis, baseSepolia } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet, sepolia, metis, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [metis.id]: http(),
    [baseSepolia.id]: http(),
  },
});
