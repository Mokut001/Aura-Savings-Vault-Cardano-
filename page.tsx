'use client';
import { useState, useEffect } from "react";
import { getLucid } from "../lib/lucid";
import { deposit, withdraw, scriptAddress } from "../lib/contract";
import { Lucid } from "lucid-cardano";

export default function Home() {
  const [lucid, setLucid] = useState<Lucid | null>(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [vaultBalance, setVaultBalance] = useState(0);
  const [target, setTarget] = useState(100);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const connect = async () => {
    const l = await getLucid();
    const api = await (window as any).cardano.nami.enable();
    l.selectWallet(api);
    setLucid(l);
    setAddress(await l.wallet.address());
  };

  const syncVault = async () => {
    if (!lucid) return;
    const utxos = await lucid.utxosAt(scriptAddress);
    const total = utxos.reduce((acc, u) => acc + Number(u.assets.lovelace), 0);
    setVaultBalance(total / 1_000_000);
  };

  useEffect(() => { if(lucid) syncVault(); }, [lucid]);

  const progress = Math.min((vaultBalance / target) * 100, 100);

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-neutral-900 border border-white/10 p-8 rounded-[2rem] shadow-2xl">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black tracking-tighter text-yellow-500 italic">AuraVault</h1>
          {!address ? (
             <button onClick={connect} className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold">Connect</button>
          ) : (
             <span className="text-[10px] font-mono opacity-50 truncate w-24">{address}</span>
          )}
        </div>

        <div className="mb-10 text-center">
          <div className="text-sm uppercase tracking-widest text-slate-500 mb-2">My Savings</div>
          <div className="text-6xl font-black">
            {vaultBalance} <span className="text-xl text-yellow-500">ADA</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-xs font-bold mb-3">
            <span className="text-slate-400">TARGET: {target} ADA</span>
            <span className={progress >= 100 ? "text-green-500" : "text-yellow-500"}>{progress.toFixed(0)}% REACHED</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
             <div className={`h-full transition-all duration-1000 ${progress >= 100 ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'bg-yellow-500'}`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {progress >= 100 && (
           <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl text-sm font-bold text-center mb-6 animate-pulse">
             🎯 TARGET REACHED! WITHDRAWAL UNLOCKED.
           </div>
        )}

        <div className="space-y-4">
          <input 
            type="number"
            className="w-full bg-neutral-800 border-none rounded-2xl p-4 focus:ring-2 ring-yellow-500 outline-none transition"
            placeholder="ADA Amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          <button 
            onClick={() => deposit(lucid!, Number(amount), target)}
            className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition"
          >
            DEPOSIT
          </button>
          <button 
            disabled={progress < 100}
            onClick={async () => {
                const utxos = await lucid!.utxosAt(scriptAddress);
                await withdraw(lucid!, utxos);
            }}
            className={`w-full py-4 font-black rounded-2xl transition ${progress >= 100 ? 'bg-blue-600 hover:bg-blue-500' : 'bg-neutral-800 text-slate-500 opacity-50 cursor-not-allowed'}`}
          >
            WITHDRAW
          </button>
        </div>
      </div>
    </main>
  );
}