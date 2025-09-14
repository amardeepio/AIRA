## Overall Design Philosophy & Vibe
The aesthetic should be a blend of a modern fintech platform (like Stripe or Coinbase) and a premium real estate site (like Zillow). We're not just another NFT project; we're a serious investment tool.

Look & Feel: Clean, minimalist, and data-driven. We'll use ample white space, sharp typography, and a professional color palette.

Core Principle: Clarity over clutter. Every element on the screen must serve a purpose.

UI Kit: Using shadcn/ui and Tailwind CSS is the right call. It allows us to build a custom, high-quality design system quickly without being locked into a specific visual style.

Typography: We'll use a highly readable sans-serif font like Inter or Satoshi for all text and data.

## Key Pages & Their Features
1. The Homepage / Landing Page
This is our digital storefront. Its job is to explain the value of AIRA in seconds.

Hero Section: A powerful headline like "The New Way to Own Real Estate." followed by a concise sub-heading and a primary call-to-action button: "Explore Properties".

How It Works: A simple, 3-step visual guide: 1. Browse AI-vetted properties. 2. Buy fractions instantly. 3. Earn rental income.

Featured Properties: A curated carousel of attractive, high-yield properties to draw users in immediately.

Trust & Data: A section highlighting the power of our AI with stats like "10,000+ data points analyzed per property."

2. Property Marketplace Page
This is the core discovery engine of the platform.

Layout: A clean grid of Property Cards. Each card will display a high-quality image, address, price per fraction, and key metrics like projected annual yield.

Filtering & Sorting: This is crucial. Users must be able to filter by:

Location (City, Neighborhood)

Price Range

Projected Yield (%)

Asset Type (e.g., Residential, Commercial)

Search Bar: A prominent, fast search bar.

3. Individual Property Page
This page is where the investment decision happens. It needs to be rich with information but not overwhelming.

Header: A gallery of high-quality property photos, the property title, and key stats at the top (Total Value, Price/Share, Yield).

Investment Widget: A clean and simple interface to buy or sell fractions. Users can input the amount of USDC they want to spend or the number of fractions they want to buy, and the UI will calculate the other.

Data Tabs: An elegant tabbed component to organize information:

Overview: A detailed description of the property.

AI Valuation: This is our killer feature. An interactive chart from our AIRA Valuation Engine showing the property's estimated value over time, with key drivers highlighted.

Financials: Clear data tables showing rental income history, property taxes, and management fees.

Documents: Secure and verifiable links to legal documents stored on IPFS.

4. Investor Dashboard
This is the user's personal command center.

Portfolio Overview: A large, prominent chart visualizing the user's portfolio value over time. Key metrics like Total Value, Total Returns, and Lifetime Earnings are displayed clearly.

My Holdings: A table listing each property the user has invested in, showing the number of fractions owned, their current value, and the income earned from each.

AIRA Score: A dedicated section displaying the user's calculated on-chain credit score, with a button to see what factors are influencing it. This directly connects their DeFi activity to real-world asset financing.

Transaction History: A filterable list of all buy/sell orders and rental income distributions.

## Core UX & Interactive Elements
Seamless Wallet Connection: The "Connect Wallet" flow will be powered by wagmi and presented in a clean modal. Once connected, the button should display the user's ENS name or truncated address, with a simple dropdown to disconnect or copy the address.

Loading States: To make the app feel fast and professional, we'll use skeleton loaders for property cards and charts while data is being fetched from the blockchain or our backend. This is much better than a jarring loading spinner.

Instant Feedback: We'll use non-intrusive toast notifications (e.g., via react-hot-toast) to confirm actions like "Transaction Submitted" or "Fractions Purchased Successfully." ✅

Full Responsiveness: Using Tailwind CSS, every single page will be designed mobile-first, ensuring a perfect experience whether the user is on a 4K monitor or their phone on the go.
