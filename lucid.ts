
import { Lucid, Blockfrost } from "lucid-cardano";

export const initLucid = async () => {
  const lucid = await Lucid.new(
    new Blockfrost(
      process.env.NEXT_PUBLIC_BLOCKFROST_URL!,
      process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!
    ),
    "Preview"
  );
  return lucid;
};
