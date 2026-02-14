import React, { useState } from 'react';
import { Gift, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { claimReward } from '../services/apiService';

interface Props {
  address: string;
}

export const RewardButton: React.FC<Props> = ({ address }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleClaim = async () => {
    if (loading) return;
    
    setLoading(true);
    setStatus('idle');
    setMessage("");

    try {
      const result = await claimReward(address);
      if (result.error) {
        setStatus('error');
        setMessage(result.error);
      } else {
        setStatus('success');
        setMessage(result.message || "Reward claimed successfully!");
      }
    } catch (err) {
      setStatus('error');
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-dark-800 to-dark-700 border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors duration-500" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Gift className="text-brand-400" size={20} />
            Daily Faucet
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Claim your free 100 WGPT tokens to start playing.
          </p>
        </div>

        <button
          onClick={handleClaim}
          disabled={loading || status === 'success'}
          className={`
            relative px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
            flex items-center gap-2 min-w-[140px] justify-center
            ${status === 'success' 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default' 
              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'}
          `}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Claiming...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle size={16} />
              <span>Claimed</span>
            </>
          ) : (
            <span>Claim 100 WGPT</span>
          )}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
          status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
        }`}>
          {status === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
          {message}
        </div>
      )}
    </div>
  );
};