import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "dotenv/config";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || "";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    "base-sepolia": {
      url: BASE_SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
