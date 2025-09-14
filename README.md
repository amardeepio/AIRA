# AIRA (Artificial Intelligence Real-estate Assets)

AIRA is a next-generation Real World Asset (RWA) marketplace that makes investing in real estate as simple, liquid, and transparent as trading stocks. By converting physical properties into fractional NFT shares, we unlock a multi-trillion dollar asset class for retail investors globally.

Our unique advantage lies in the integration of a proprietary AI engine that provides users with institutional-grade analytics. This includes real-time property valuations, predictive market analysis, and a novel on-chain mortgage eligibility score, removing the guesswork and high barriers to entry that plague the traditional real estate market.

## Technology Stack

Our platform is built using a modern, robust technology stack across three main components:

### Frontend
- **Next.js 15** - React framework for production-ready applications
- **TypeScript** - Strongly typed programming language for better code quality
- **Tailwind CSS v4** - Utility-first CSS framework for rapid UI development
- **wagmi & viem** - Libraries for interacting with Ethereum wallets and blockchain
- **RainbowKit & Web3Modal** - Libraries for wallet connection UI
- **Radix UI** - Accessible UI component primitives
- **Framer Motion** - Animation library for React
- **Recharts** - Charting library built with D3

### Backend
- **NestJS** - Progressive Node.js framework for building scalable server-side applications
- **TypeScript** - Strongly typed programming language
- **PostgreSQL** - Robust relational database
- **Prisma** - Type-safe database client and ORM
- **TensorFlow.js** - JavaScript library for machine learning models
- **Pinata** - IPFS service for decentralized storage
- **viem/ethers.js** - Libraries for blockchain interaction

### Smart Contracts
- **Solidity 0.8.24** - Smart contract programming language
- **Hardhat** - Development environment for Ethereum software
- **OpenZeppelin** - Secure smart contract library with upgradeable contracts
- **ERC-1155** - Multi-token standard for property fractions
- **UUPS Upgradeable Contracts** - Modern proxy upgrade pattern

## High-Level Architecture

```plaintext
[User on Browser] <--> [Next.js Frontend] <--> [wagmi/viem] <--> [Blockchain (EVM)]
       ^                               ^
       |                               |
       | (API Calls)                   | (Smart Contract Calls)
       v                               v
[NestJS Backend] <--> [PostgreSQL DB] & [AI Models]
       ^                               ^
       |                               |
       +------> [IPFS for Documents] <--+
```

## Project Structure

This project is a monorepo containing three main packages:

-   `frontend/`: A [Next.js](https://nextjs.org/) application for the user interface.
-   `backend/`: A [NestJS](https://nestjs.com/) application for the API and business logic.
-   `contracts/`: Solidity smart contracts managed with [Hardhat](https://hardhat.org/).

## Getting Started

### Prerequisites

-   Node.js (v20.11 or later)
-   npm (v10.2.4 or later)
-   A crypto wallet (e.g., MetaMask) with funds on the Base Sepolia testnet.

### Setup

1.  **Install Dependencies:**
    Install dependencies for all workspaces from the root directory:
    ```bash
    npm install
    ```

2.  **Environment Variables:**
    Create a `.env` file in the root directory of the project. You will need to add the following variables. You can get an RPC URL from a provider like Infura or Alchemy.

    ```
    BASE_SEPOLIA_RPC_URL="your_base_sepolia_rpc_url"
    PRIVATE_KEY="your_wallet_private_key"
    PINATA_JWT="your_pinata_jwt_token"
    ```

### Running the Application

1.  **Run Frontend and Backend:**
    To run the frontend and backend concurrently for development, use the following command from the root directory:
    ```bash
    npm run dev
    ```
    -   The frontend will be available at `http://localhost:3000`.
    -   The backend will be available at `http://localhost:3001`.

2.  **Deploying Smart Contracts:**
    To deploy the smart contracts to the Base Sepolia testnet, run:
    ```bash
    npx hardhat run scripts/deploy.ts --network base-sepolia
    ```
