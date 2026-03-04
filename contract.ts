import { Lucid, Data, UTxO } from "lucid-cardano";

const SavingsDatumSchema = Data.Object({
  ownerPKH: Data.String,
  targetLovelace: Data.BigInt,
});

export const scriptAddress = "addr_test1..."; // Set your compiled address here

export const deposit = async (lucid: Lucid, amountADA: number, targetADA: number) => {
  const pkh = lucid.utils.getAddressDetails(await lucid.wallet.address()).paymentCredential?.hash!;
  const datum = Data.to({
    ownerPKH: pkh,
    targetLovelace: BigInt(targetADA * 1_000_000),
  }, SavingsDatumSchema);

  const tx = await lucid.newTx()
    .payToContract(scriptAddress, { inline: datum }, { lovelace: BigInt(amountADA * 1_000_000) })
    .complete();
  
  const signed = await tx.sign().complete();
  return await signed.submit();
};

export const withdraw = async (lucid: Lucid, utxos: UTxO[]) => {
  const redeemer = Data.to("Withdraw");
  const tx = await lucid.newTx()
    .collectFrom(utxos, redeemer)
    .addSigner(await lucid.wallet.address())
    .complete();
    
  const signed = await tx.sign().complete();
  return await signed.submit();
};