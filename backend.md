
# AIRA Backend Architecture & Technical Specification (TypeScript Edition)

## 1. Overview

The backend for AIRA serves as the central nervous system for our platform. It is responsible for managing off-chain data, serving our proprietary AI-driven analytics, handling user-specific queries, and interfacing with decentralized storage (IPFS). It is designed to be a high-performance, scalable, and secure API server built with **TypeScript** and the **NestJS** framework.

## 2. Technology Stack

| Category | Technology | Justification |
|---|---|---|
| **Framework** | `NestJS` | A progressive Node.js framework for building efficient, reliable, and scalable server-side applications with excellent TypeScript support. |
| **Language** | `TypeScript` | Provides strong typing to JavaScript, reducing bugs and improving developer experience and code maintainability. |
| **Database** | `PostgreSQL` with `Prisma` | PostgreSQL is a robust relational database. Prisma will be used as the ORM for type-safe database access. |
| **AI/ML** | `TensorFlow.js` | Allows for defining, training, and running machine learning models in TypeScript. While the Python ecosystem is more mature for ML, TensorFlow.js is powerful enough for our needs and keeps our stack unified. |
| **Decentralized Storage**| `IPFS` (via `Pinata`) | To store and retrieve legal documents and property metadata in a verifiable, decentralized manner. |
| **Deployment** | `Railway` / `Render` | Developer-friendly platforms that offer seamless deployment, scaling, and management for Node.js applications. |
| **Blockchain Interaction**| `viem` / `ethers.js` | Modern and efficient libraries for interacting with the Ethereum blockchain, consistent with the frontend stack. |

## 3. Database Schema (PostgreSQL)

The relational schema remains the same. We will use the **Prisma ORM** to generate a type-safe client for interacting with these tables from our NestJS application.

**`properties`**
```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  token_id INTEGER UNIQUE, -- Corresponds to the ERC-1155 token ID
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  image_urls JSONB, -- An array of URLs to images
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**`documents`**
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  ipfs_hash VARCHAR(255) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(50), -- e.g., 'Deed', 'Inspection Report'
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**`valuation_history`**
```sql
CREATE TABLE valuation_history (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id),
  valuation_date DATE NOT NULL,
  estimated_value NUMERIC(18, 2) NOT NULL,
  UNIQUE(property_id, valuation_date)
);
```

## 4. API Endpoints (NestJS)

The API structure will be implemented using NestJS controllers and services, maintaining the same RESTful contract with the frontend.

#### Properties
- `GET /properties`
- `GET /properties/{token_id}`
- `POST /properties` (Admin-only)

#### AI Engine
- `GET /ai/valuation/{token_id}`
- `GET /ai/opportunity-map`
- `GET /ai/score/{wallet_address}`

#### IPFS
- `POST /ipfs/upload` (Admin-only)

#### Portfolio
- `GET /portfolio/{wallet_address}`

## 5. AI/ML Model Breakdown

The models will be developed and served using **TensorFlow.js**.

1.  **AIRA Valuation Model:**
    - **Type:** Regression Model.
    - **Input:** Property features (square feet, bedrooms, etc.), market trends.
    - **Output:** Estimated fair market value.

2.  **AIRA Opportunity Map Model:**
    - **Type:** Geospatial Regression Model.
    - **Input:** Location-based data, historical yields.
    - **Output:** Predicted rental yield and appreciation potential for a given area.

3.  **AIRA Score Model:**
    - **Type:** Scoring/Classification Model.
    - **Input:** On-chain wallet data (transaction history, DeFi interactions, etc.).
    - **Output:** A numerical score representing on-chain creditworthiness.

## 6. Background Services

**Blockchain Event Listener:**
A NestJS service will be created to subscribe to smart contract events using a `viem` client. This can be implemented as a long-running process or using the built-in Task Scheduling features of NestJS to periodically poll for new events. This keeps the off-chain database in sync with the blockchain for a fast and reliable user experience.
