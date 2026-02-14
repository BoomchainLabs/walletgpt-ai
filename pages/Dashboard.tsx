import React, { useEffect, useState } from 'react';
import { RewardButton } from "../components/RewardButton";
import { GameInterface } from "../components/GameInterface";
import { NFTGallery } from "../components/NFTGallery";
import { fetchTokenBalances, fetchNFTs } from "../services/apiService";
import { TokenBalance } from "../types";
import { Coins, Layers, Activity, LayoutGrid } from 'lucide-react';

interface Props {
  address: string;
}

export const Dashboard: React.FC<Props> = ({ address }) => {
  const [nativeBalance, setNativeBalance] = useState<string>("0.0000");
  const [nftCount, setNftCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        // Fetch Tokens
        const tokens = await fetchTokenBalances(address);
        // Find Native ETH (Base)
        const eth = tokens.find(t => t.contractType === 'NATIVE' || t.symbol === 'ETH');
        if (eth) {
          // Simple format for display (assuming 18 decimals)
          const val = parseFloat(eth.balance) / Math.pow(10, eth.decimals);
          setNativeBalance(val.toFixed(4));
        }

        // Fetch NFT Count
        const nfts = await fetchNFTs(address);
        setNftCount(nfts.length);

      } catch (error) {
        console.error("Error loading dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      loadStats();
    }
  }, [address]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400">
              <Coins size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">Native Balance</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? "..." : nativeBalance} <span className="text-sm font-normal text-gray-500">ETH</span>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <Layers size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">NFT Collection</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {loading ? "..." : nftCount} <span className="text-sm font-normal text-gray-500">Items</span>
          </div>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Activity size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">Network</span>
          </div>
          <div className="text-2xl font-bold text-green-400">Base Mainnet</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Game/Chat Area */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-white">AI Command Center</h2>
          <GameInterface address={address} />
          
          <div className="pt-8">
             <div className="flex items-center gap-2 mb-6">
                <LayoutGrid size={20} className="text-brand-400" />
                <h2 className="text-xl font-bold text-white">Your Collection</h2>
             </div>
             <NFTGallery address={address} />
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Actions</h2>
          
          <RewardButton address={address} />

          <div className="p-6 rounded-2xl bg-dark-800 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-4">About WalletGPT</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              WalletGPT analyzes your on-chain data using Google Gemini. 
              Claim daily rewards to track your engagement (stored on Firestore).
            </p>
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">AI Model</span>
                <span className="text-brand-400 font-mono">Gemini 3 Flash</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Data Source</span>
                <span className="text-white font-mono">Sequence Indexer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};