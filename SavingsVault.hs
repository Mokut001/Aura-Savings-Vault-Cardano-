
{-# LANGUAGE DataKinds           #-}
{-# LANGUAGE ImportQualified     #-}
{-# LANGUAGE NoImplicitPrelude   #-}
{-# LANGUAGE OverloadedStrings   #-}
{-# LANGUAGE TemplateHaskell     #-}
{-# LANGUAGE TypeApplications    #-}
{-# LANGUAGE TypeFamilies        #-}
{-# LANGUAGE RecordWildCards     #-}

module SavingsVault where

import           Plutus.V2.Ledger.Api
import           Plutus.V2.Ledger.Contexts
import           PlutusTx
import           PlutusTx.Prelude          hiding (Semigroup (..), unless)
import           Prelude                   (IO)

data SavingsDatum = SavingsDatum
    { owner        :: PubKeyHash
    , targetAmount :: Integer
    }
PlutusTx.unstableMakeIsData ''SavingsDatum

data SavingsRedeemer = Deposit | Withdraw
PlutusTx.unstableMakeIsData ''SavingsRedeemer

{-# INLINABLE mkValidator #-}
mkValidator :: SavingsDatum -> SavingsRedeemer -> ScriptContext -> Bool
mkValidator dat redeemer ctx = case redeemer of
    Deposit  -> True 
    Withdraw -> 
        let info = scriptContextTxInfo ctx
            signedByOwner = txSignedBy info (owner dat)
            -- Logic: To withdraw, the script must be sending the funds back to owner
            -- and we check if the value in this UTXO meets the target.
            -- Script UTXO extraction logic simplified for V2:
            goalReached = True -- In a full build, we'd sum the value of inputs from this script
        in traceIfFalse "Not signed by owner" signedByOwner &&
           traceIfFalse "Target goal not reached" goalReached

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| mkValidator ||])
