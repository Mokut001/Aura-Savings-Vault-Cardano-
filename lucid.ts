import { Lucid, Blockfrost } from "lucid-cardano";

export const getLucid = async () => {
    const lucid = await Lucid.new(
        new Blockfrost(
            "https://cardano-preview.blockfrost.io/api/v0", 
            process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY!
        ),
        "Preview"
    );
    return lucid;
};