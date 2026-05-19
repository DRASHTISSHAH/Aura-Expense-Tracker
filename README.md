# Aura expense tracker

An ultra-premium, high-fidelity **Unified Expense Tracking & Financial Automation** platform. This application combines a state-of-the-art **React 19 / Vite** single-page application (SPA) with a lightweight **Express API gateway** and a secure **Supabase PostgreSQL** cloud backend. 

Featuring interactive **Three.js 3D elements**, automatic **AI-powered Vision OCR Receipt Scanning**, real-time **global currency conversions**, and **Aura**—your personal LLM-powered conversational financial advisor, this platform is designed to make wealth management both beautiful and effortless.

---

## 🗺️ Table of Contents
- [✨ Key Feature Highlights](#-key-feature-highlights)
- [📁 Folder Structure](#-folder-structure)
- [🚀 Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [1. Clone \& Setup Workspace](#1-clone--setup-workspace)
  - [2. Environment Configuration (`.env`)](#2-environment-configuration-env)
  - [3. Supabase Cloud Configuration](#3-supabase-cloud-configuration)
  - [4. Running the Application](#4-running-the-application)
- [🧠 Premium AI Integrations](#-premium-ai-integrations)
- [💳 Wallet, Savings, & Investment Portfolios](#-wallet-savings--investment-portfolios)
- [🔒 Row-Level Security (RLS) & Policies](#-row-level-security-rls--policies)
---

## ✨ Key Feature Highlights

### 🎨 1. Cinematic 3D Landing & Portal Transition
* **Interactive 3D Space:** Leveraging `@react-three/fiber` and `@react-three/drei`, the hero section welcomes users with a highly polished, interactive 3D metallic credit card.
* **Fluid Scroll-Linked Animations:** Scroll triggers seamlessly morph and reposition the 3D canvas, guiding the user organically into a glassmorphic authentication portal.
* **Harmonious Dark Mode:** Native system preference integration combined with a custom aesthetic dashboard featuring subtle micro-animations, neon-tinted borders, and premium CSS gradients.

### 🔍 2. AI-Powered OCR Receipt Scanner
* **Fidelity Optimization:** Compresses uploaded receipt images to optimal sizes, maintaining pristine text legibility for multimodal intelligence.
* **Multimodal Extraction:** Powered by **meta-llama/llama-4-scout-17b-16e-instruct** (via Groq Cloud), extracting merchant names, exact amounts, purchase categories, dates, and short descriptions instantly.
* **Automatic Ledger Routing:** Scanned expenses automatically pre-fill transaction modules for rapid, one-click ledger insertion.

### 💬 3. Aura — Conversational Wealth Assistant
* **Context-Aware Recommendations:** Aura, built on top of **llama-3.3-70b-versatile**, receives a compressed snapshot of the user's active transaction ledger.
* **Tailored Financial Advice:** Ask Aura to summarize your monthly habits, request actionable savings tips, identify your largest outlays, or receive personalized budget pacing advice.
* **Dynamic Quick Prompts:** Single-tap suggestion bubbles for fast, zero-typing interactions.

### 💱 4. Multi-Currency Engine & Custom Tokens
* **Real-time Live Conversions:** Integrates the ExchangeRate API to convert all transactions across global currency indices (`USD`, `INR`, `EUR`, `GBP`, etc.) on the fly.
* **User-Defined Custom Currencies:** Create and calculate custom currencies with specific exchange multipliers. All metrics, wallet values, and charts translate instantly to your selected base token.

### 📊 5. Visual Dashboard & Ledgers
* **Financial Analytics:** Powered by `Recharts`, providing clean expense category breakdowns, income vs. expense progress over time, and dynamic transaction lists.
* **Advanced Filters:** Easily audit assets using date range selectors (`1w`, `1m`, `6m`, `all`), search query indices, and localized categorization rules.

---

## 📁 Folder Structure

The repository is structured to organize the frontend source and backend controllers separately:

```text
├── config/                  # Server configuration (Supabase init, WebSocket polyfills)
│   └── supabase.js          
├── controllers/             # Backend controller files handling DB queries
│   ├── investmentsController.js
│   ├── savingsController.js
│   ├── transactionController.js
│   └── walletController.js
├── middleware/              # Express authentication verify middleware
│   └── authMiddleware.js
├── public/                  # Public static assets for the client
├── routes/                  # Express API routers mapping endpoints to controllers
│   ├── investmentsRoutes.js
│   ├── savingsRoutes.js
│   ├── transactionRoutes.js
│   └── walletRoutes.js
├── src/                     # React 19 Frontend Codebase
│   ├── assets/              # Custom design SVGs, styles, & media
│   ├── components/          # Reusable dashboard widgets, forms, and canvas modules
│   │   ├── dashboard/       # Specialized layout items (Wallet stacks, charts)
│   │   ├── landing/         # Three.js 3D canvas and scroll indicators
│   │   ├── ui/              # Atom-level UI styling components
│   │   ├── App.jsx          # Root view selector and state aggregator
│   │   └── ...              # Modals (OCR, Custom Currency, Savings, etc.)
│   ├── services/            # API call modules (auth, backend REST hooks, AI calls)
│   │   ├── aiService.js     # Groq API wrappers (Llama-4 Scout and Llama-3.3 LLM)
│   │   ├── api.js           # Express API Axios Client with Authorization headers
│   │   ├── auth.js          # Supabase client-side OAuth / Email sign-in hooks
│   │   └── currencyService.js# Exchange rate services
│   ├── index.css            # Base Tailwind imports & bespoke utility classes
│   └── main.jsx             # Entrypoint rendering virtual DOM
├── supabase_schema.sql      # Database schema definitions and RLS policies
├── server.js                # Core Express API entrypoint
├── tailwind.config.js       # Custom animations, font tokens, and palettes
├── vite.config.js           # Client bundling compiler rules
└── package.json             # NPM package script and configuration details
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** (v18.x or higher recommended)
* **NPM** or **Yarn** package manager
* A **Supabase Account** (to host your PostgreSQL database)
* A **Groq Cloud API Key** (to power Aura and the Receipt OCR Scan)
* An **ExchangeRate-API Key** (optional, fallback is standard rates)

### 1. Clone & Setup Workspace
Initialize the directory and download project package dependencies:
```bash
# Install package dependencies
npm install
```

### 2. Environment Configuration (`.env`)
Create a `.env` file in the root workspace folder and supply the following variables:
```env
# Backend Environment Variables
SUPABASE_URL=https://your-supabase-project-id.supabase.co
SUPABASE_KEY=your-supabase-service-role-or-anon-key
PORT=5000

# Frontend Environment Variables
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:5000/api
VITE_AURA_AI_KEY=your-groq-api-key
VITE_EXCHANGE_RATE_API_KEY=your-exchangerate-api-key
```

### 3. Supabase Cloud Configuration
To set up your database tables, run the queries located in `supabase_schema.sql` inside the **Supabase SQL Editor** for your project. This will:
1. Create the `transactions` table.
2. Enable Row-Level Security (RLS) for absolute data containment.
3. Configure indices for fast chronological indexing.
4. Establish the `wallets` table, linking transactional expenses to specific financial credit/debit cards.

### 4. Running the Application
Use NPM developer scripts to launch both the backend API and frontend Vite servers concurrently:
```bash
# Runs frontend (Vite) and backend (Express) concurrently
npm run dev

# Or run them separately if preferred
npm run dev:ui    # Launch Vite Client (Default: Port 3000)
npm run dev:api   # Launch Express API Server (Default: Port 5000)
```

Open `http://localhost:3000` in your web browser to experience the platform.

---

## 🧠 Premium AI Integrations

The AI utilities connect directly LLM API endpoint for maximum throughput speed:
* **multimodal receipt OCR:**
  * Uses the state-of-the-art vision intelligence model `meta-llama/llama-4-scout-17b-16e-instruct` to scan base64 JPEG attachments.
  * Formats data strictly via structured JSON schemas, mapping parsed data straight into your manual loggers.
* **Aura AI chatbot:**
  * Backed by `llama-3.3-70b-versatile` with custom system configurations.
  * Formats responses using beautiful custom markdown parsing that matches the theme colors automatically.

---

## 💳 Wallet, Savings, & Investment Portfolios

* **The Wallet Stack:** Rendered in beautiful 3D-like hoverable panels with dynamic gradients matching their custom visual themes. Keep track of card limits, balances, and specific transaction entries.
* **Savings Target Gauges:** Set monetary milestones, track completion percentages via interactive progress rings, and allocate standard funds.
* **Investment Portfolio Ledger:** Track high-yielding investment assets, market prices, and dynamic visual indicators of portfolio percentages.

---

## 🔒 Row-Level Security (RLS) & Policies

Data integrity and privacy are enforced at the database level by Supabase PostgreSQL Row Level Security (RLS):
* Every single row in `transactions`, `wallets`, `savings`, and `investments` contains a `user_id` field mapped directly to the authentication manager `auth.uid()`.
* Access policies block any third party from fetching, modifying, inserting, or removing rows that do not belong to the currently logged-in user session:
```sql
CREATE POLICY "Users can only access their own transactions" 
ON transactions FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);
```
