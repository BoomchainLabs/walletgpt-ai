import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { claimReward, checkClaimStatus } from '../services/apiService';

interface Props {
  address: string;
}

export const RewardButton: React.FC<Props> = ({ address }) => {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState("");

  // Check claim status on load
  useEffect(() => {
    const verifyStatus = async () => {
      setChecking(true);
      const { canClaim, error } = await checkClaimStatus(address);
      if (error) {
        console.error(error);
      } else if (!canClaim) {
        setStatus('success');
        setMessage("You've already claimed your daily reward today!");
      }
      setChecking(false);
    };

    if (address) {
      verifyStatus();
    }
  }, [address]);

  const handleClaim = async () => {
    if (loading || status === 'success') return;
    
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
        setMessage(result.message || "100 WGPT rewards successfully added to your vault!");
      }
    } catch (err) {
      setStatus('error');
      setMessage("Connection lost. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="mt-6 p-6 rounded-2xl bg-dark-800 border border-white/5 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 bg-white/10 rounded mb-2"></div>
          <div className="h-10 w-32 bg-white/10 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-900 border border-white/5 relative overflow-hidden group shadow-xl">
      <div className="absolute inset-0 bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors duration-500" />
      
      {/* Background Decorative Sparkle */}
      <div className={`absolute -right-4 -top-4 text-brand-500/10 transition-transform duration-1000 ${status !== 'success' ? 'group-hover:scale-150' : ''}`}>
        <Sparkles size={120} />
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <Gift className={status === 'success' ? 'text-green-400' : 'text-brand-400'} size={20} />
            Daily Engagement Reward
          </h3>
          <p className="text-sm text-gray-400 mt-1 max-w-[220px]">
            {status === 'success' 
              ? "Your vault is topped up! Come back in 24 hours for more." 
              : "Claim 100 WGPT points every day to grow your AI influence."}
          </p>
        </div>

        <button
          onClick={handleClaim}
          disabled={loading || status === 'success'}
          className={`
            relative px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300
            flex items-center gap-2 min-w-[160px] justify-center overflow-hidden
            ${status === 'success' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/30 cursor-default opacity-80' 
              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'}
          `}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Verifying...</span>
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle size={18} />
              <span>Secured</span>
            </>
          ) : (
            <>
              <Sparkles size={16} className="animate-pulse" />
              <span>Claim Points</span>
            </>
          )}
          
          {/* Shine effect on hover */}
          {status !== 'success' && (
             <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
          )}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-4 rounded-xl text-xs font-medium flex items-start gap-3 border animate-fade-in ${
          status === 'error' 
            ? 'bg-red-500/10 text-red-400 border-red-500/20' 
            : 'bg-brand-500/10 text-brand-400 border-brand-500/20'
        }`}>
          {status === 'error' ? (
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
          ) : (
            <CheckCircle size={16} className="shrink-0 mt-0.5 text-green-400" />
          )}
          <span className="leading-relaxed">{message}</span>
        </div>
      )}
      
      <style>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .animate-shine {
          animation: shine 0.8s;
        }
      `}</style>
    </div>
  );
};