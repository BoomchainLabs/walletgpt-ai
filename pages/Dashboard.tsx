import React from 'react';
import { RewardButton } from "../components/RewardButton";
import { GameInterface } from "../components/GameInterface";
import { NFTGallery } from "../components/NFTGallery";
import { Coins, TrendingUp, Activity, LayoutGrid } from 'lucide-react';

interface Props {
  address: string;
}

export const Dashboard: React.FC<Props> = ({ address }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-500/20 rounded-lg text-brand-400">
              <Coins size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">Balance</span>
          </div>
          <div className="text-2xl font-bold text-white">1,250.00 <span className="text-sm font-normal text-gray-500">WGPT</span></div>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <TrendingUp size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">Rank</span>
          </div>
          <div className="text-2xl font-bold text-white">#42 <span className="text-sm font-normal text-gray-500">Global</span></div>
        </div>

        <div className="bg-dark-800 p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
              <Activity size={20} />
            </div>
            <span className="text-gray-400 text-sm font-medium">Status</span>
          </div>
          <div className="text-2xl font-bold text-green-400">Active</div>
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
            <h3 className="text-lg font-semibold text-white mb-4">Network Info</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Network</span>
                <span className="text-white font-mono">Base Mainnet</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Block Height</span>
                <span className="text-white font-mono">12,459,203</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Gas Price</span>
                <span className="text-white font-mono">0.05 gwei</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};