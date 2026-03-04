
import { Lucid, Data, UTxO } from "lucid-cardano";

const SavingsDatumSchema = Data.Object({
  owner: Data.String,
  targetAmount: Data.BigInt,
});

export const depositADA = async (lucid: Lucid, amount: number, target: number, scriptAddr: string) => {
  const pkh = lucid.utils.getAddressDetails(await lucid.wallet.address()).paymentCredential?.hash!;
  const datum = Data.to({
    owner: pkh,
    targetAmount: BigInt(target * 1_000_000),
  }, SavingsDatumSchema);

  const tx = await lucid.newTx()
    .payToContract(scriptAddr, { inline: datum }, { lovelace: BigInt(amount * 1_000_000) })
    .complete();
  const signed = await tx.sign().complete();
  return await signed.submit();
};

export const withdrawFunds = async (lucid: Lucid, utxos: UTxO[]) => {
  const redeemer = Data.to("Withdraw");
  const tx = await lucid.newTx()
    .collectFrom(utxos, redeemer)
    .addSigner(await lucid.wallet.address())
    .complete();
  const signed = await tx.sign().complete();
  return await signed.submit();
};
