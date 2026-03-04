
module Main where

import           Cardano.Api
import           Cardano.Api.Shelley  (PlutusScript (..))
import           Codec.Serialise      (serialise)
import qualified Data.ByteString.Lazy as LBS
import qualified Data.ByteString.Short as SBS
import           SavingsVault         (validator)
import           Plutus.V2.Ledger.Api (Validator (..), unValidatorScript)

main :: IO ()
main = do
    let script = unValidatorScript validator
        sbs = SBS.toShort . LBS.toStrict $ serialise script
    writeFile "vault.plutus" (show sbs)
    putStrLn "Successfully compiled to vault.plutus"
