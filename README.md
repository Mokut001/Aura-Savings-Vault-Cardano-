# AuraVault - Cardano Savings DApp

Exactly like the blink.new reference.

## Features
- **Locked Savings**: Funds are on-chain in a Plutus V2 contract.
- **Target Logic**: Withdrawal is only enabled when the balance meets the goal.
- **End-to-End**: Includes Haskell backend and Lucid frontend.

## Deployment to Vercel
1. Upload to GitHub.
2. Link to Vercel.
3. Add Env: `NEXT_PUBLIC_BLOCKFROST_API_KEY`.

## Backend Compilation
cd contracts
cabal run compile-vault