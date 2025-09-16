# AIRA Smart Contract Architecture

This document outlines the architecture for the AIRA smart contracts, designed to be modular, scalable, and upgradable.

We will build three core contracts, all of which will be upgradable using the modern UUPS (Universal Upgradeable Proxy Standard) pattern. This allows us to deploy new features in the future without losing any data or requiring migration.

## 1. `PropertyToken.sol` (ERC-1155)

This contract is the heart of the system, representing the fractional ownership of every real estate asset on the platform.

*   **Standard:** It will be an **ERC-1155** token. This is highly efficient, as a single contract can manage tokens for all properties. Each property gets a unique `tokenId`, and the quantity of tokens represents the number of fractions a user owns.
*   **Functionality:**
    *   **Minting:** An admin (the AIRA platform) can mint a new batch of tokens for a newly onboarded property. For example, mint 10,000 fractions for `tokenId` 1 (representing a Miami Condo).
    *   **Metadata:** Each `tokenId` will have a unique URI pointing to an IPFS file with the property's details (name, location, images, legal docs).
    *   **Security:** It will be pausable, allowing trading to be frozen in an emergency.

## 2. `Marketplace.sol`

This contract will be the decentralized exchange where users buy and sell property fractions.

*   **Functionality:**
    *   **Listing:** A user can approve the `Marketplace` contract to access their `PropertyToken` fractions and list them for sale at a set price in `USDC`.
    *   **Buying:** A buyer can accept a listing and pay the `USDC` amount. The contract will automatically handle the transfer of the `USDC` to the seller and the property fractions to the buyer.
    *   **Delisting:** Sellers can cancel their active listings at any time.
*   **Fees:** The contract can be programmed with a small platform fee on each transaction, which contributes to the AIRA treasury.

## 3. `YieldDistributor.sol`

This contract automates the distribution of rental income to the property owners (fraction holders).

*   **Functionality:**
    *   **Deposit:** A designated address (e.g., a property manager) deposits rental income (in `USDC`) into this contract for a specific property (`tokenId`).
    *   **Distribution:** The contract distributes the deposited `USDC` to all current holders of that property's tokens. The amount each user receives is directly proportional to the number of fractions they own.
    *   **Claiming:** To ensure gas efficiency and security, this will be a "pull-based" system. Token holders will call a `claim()` function to withdraw their share of the rental income.

## High-Level Architecture Diagram:

```
┌──────────────────────┐      ┌────────────────────┐      ┌────────────────────────┐
│                      │      │                    │      │                        │
│  PropertyToken.sol   ├──────►   Marketplace.sol  ├──────►   YieldDistributor.sol   │
│ (ERC1155 Fractions) │      │ (Buy/Sell Logic)   │      │ (Rental Income Logic)  │
│                      │      │                    │      │                        │
└──────────┬───────────┘      └──────────┬─────────┘      └───────────┬────────────┘
           │                             │                            │
           │ (Owns/Transfers)            │ (Transfers USDC)           │ (Distributes USDC)
           ▼                             ▼                            ▼
┌──────────────────────┐      ┌────────────────────┐      ┌────────────────────────┐
│                      │      │                    │      │                        │
│         User         │◄─────►     USDC Token     │◄─────►    Property Manager    │
│                      │      │   (ERC-20)         │      │                        │
└──────────────────────┘      └────────────────────┘      └────────────────────────┘
```

This architecture ensures a clear separation of concerns, making the system easier to develop, audit, and upgrade.
