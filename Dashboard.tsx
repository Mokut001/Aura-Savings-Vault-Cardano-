
'use client';
import React, { useState } from 'react';
import { depositADA, withdrawFunds } from '../lib/contract';
import { Progress } from "./ui/progress"; // Assume a basic progress bar

export default function Dashboard({ lucid }) {
  const [balance, setBalance] = useState(0);
  const [target] = useState(100); 
  const [amt, setAmt] = useState("");

  const isGoalReached = balance >= target;

  return (
    <div className="p-10 bg-black text-white rounded-3xl border border-white/10 shadow-2xl">
      <h1 className="text-3xl font-extrabold text-yellow-500 mb-6">AuraVault</h1>
      <div className="mb-8 p-6 bg-white/5 rounded-2xl">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Target Range</span>
          <span className="font-mono">{balance} / {target} ADA</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full">
           <div className="bg-yellow-500 h-full rounded-full" style={{width: `${Math.min((balance/target)*100, 100)}%`}} />
        </div>
      </div>
      
      <input 
        type="number" 
        className="w-full bg-transparent border-b border-white/20 p-4 mb-6 focus:outline-none"
        placeholder="Enter ADA Amount" 
        onChange={(e) => setAmt(e.target.value)}
      />

      <div className="space-y-4">
        <button 
          onClick={() => depositADA(lucid, Number(amt), target, "YOUR_SCRIPT_ADDRESS")}
          className="w-full py-4 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition"
        >
          Secure Deposit
        </button>
        <button 
          disabled={!isGoalReached}
          onClick={() => withdrawFunds(lucid, [])}
          className={`w-full py-4 rounded-xl font-bold transition ${isGoalReached ? 'bg-blue-600' : 'bg-white/5 text-slate-500'}`}
        >
          {isGoalReached ? 'Withdraw Funds' : 'Goal Not Reached'}
        </button>
      </div>
    </div>
  );
}
