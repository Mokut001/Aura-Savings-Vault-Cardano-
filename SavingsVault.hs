{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE ImportQualified     #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}

module SavingsVault where

import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import           PlutusTx
import           PlutusTx.Prelude          hiding (Semigroup (..), unless)

-- | The Datum defines the vault's owner and the savings target.
data SavingsDatum = SavingsDatum
    { ownerPKH   :: PubKeyHash
    , targetLovelace :: Integer
    }
PlutusTx.unstableMakeIsData ''SavingsDatum

-- | The Redeemer allows for depositing or withdrawing.
data SavingsRedeemer = Deposit | Withdraw
PlutusTx.unstableMakeIsData ''SavingsRedeemer

{-# INLINABLE mkValidator #-}
mkValidator :: SavingsDatum -> SavingsRedeemer -> ScriptContext -> Bool
mkValidator dat redeemer ctx =
    let info = scriptContextTxInfo ctx
        
        -- Verification 1: Must be signed by the owner in the datum
        isOwner = txSignedBy info (ownerPKH dat)

        -- Verification 2: Check total ADA value in the script UTXO being spent
        -- Note: In a spend script context, findOwnInput gives the UTXO being validated
        ownInput = case findOwnInput ctx of
            Just i -> i
            Nothing -> traceError "Input not found"
        
        currentValue = valueOf (txInInfoResolved ownInput) adaSymbol adaToken
        
        -- Goal reached check
        goalReached = currentValue >= targetLovelace dat

    in case redeemer of
        Deposit  -> True -- Deposit logic is handled by UI producing a valid script output
        Withdraw -> traceIfFalse "You are not the owner" isOwner &&
                    traceIfFalse "Savings goal not yet met" goalReached

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| mkValidator ||])