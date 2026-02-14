import React from 'react';
import { SequenceConnectInlineProvider } from "@0xsequence/connect";
import { sequenceConfig } from "../sequenceConfig";
import { Zap, Shield, Bot } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 text-center animate-fade-in">
      <div className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
          Live on Base Mainnet
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-brand-200 to-brand-500">
          WalletGPT
        </h1>
        
        <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
          The next generation of Web3 gaming. Connect your wallet to chat with AI, claim rewards, and manage your assets on Base.
        </p>
      </div>

      <div className="w-full max-w-md bg-dark-800/50 backdrop-blur-sm p-4 rounded-2xl border border-white/5 shadow-2xl">
        {/* Sequence Connect Inline Provider for embedded login experience */}
        <SequenceConnectInlineProvider config={sequenceConfig} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 w-full max-w-4xl">
        {[
          { icon: Zap, title: "Instant", desc: "Lightning fast transactions on Base" },
          { icon: Shield, title: "Secure", desc: "Powered by Sequence Wallet-as-a-Service" },
          { icon: Bot, title: "Smart", desc: "AI-driven insights for your portfolio" }
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-dark-900 flex items-center justify-center text-brand-400">
              <item.icon size={24} />
            </div>
            <h3 className="font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};