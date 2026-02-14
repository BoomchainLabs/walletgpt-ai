import React, { useEffect, useState } from 'react';
import { fetchNFTs } from '../services/apiService';
import { NFT } from '../types';
import { Image, ExternalLink, Loader2, Wallet } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface Props {
  address: string;
}

export const NFTGallery: React.FC<Props> = ({ address }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const data = await fetchNFTs(address);
        setNfts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (address) {
      loadNFTs();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-dark-800 rounded-2xl border border-white/5">
        <Loader2 className="animate-spin text-brand-500 mb-2" size={32} />
        <p className="text-gray-400 text-sm">Loading your digital collectibles...</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-dark-800 rounded-2xl border border-white/5 text-center">
        <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center mb-4 text-gray-500">
          <Wallet size={32} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No NFTs Found</h3>
        <p className="text-gray-400 max-w-xs mx-auto">
          We couldn't find any NFTs in this wallet on Base. Try claiming the reward to get some activity started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {nfts.map((nft, idx) => (
        <div 
          key={`${nft.contractAddress}-${nft.tokenId}-${idx}`} 
          className="bg-dark-800 rounded-xl overflow-hidden border border-white/5 hover:border-brand-500/50 transition-all group relative"
        >
          <div className="aspect-square bg-dark-900 relative overflow-hidden">
            {nft.image ? (
              <img 
                src={nft.image} 
                alt={nft.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-600">
                <Image size={32} />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-transparent to-transparent opacity-60" />
            
            <Tooltip 
              content="View on Basescan" 
              position="left" 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <a 
                href={`https://basescan.org/token/${nft.contractAddress}?a=${nft.tokenId}`} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-black/40 backdrop-blur-md rounded-lg text-white hover:bg-brand-500 border border-white/10 block"
              >
                <ExternalLink size={14} />
              </a>
            </Tooltip>
          </div>
          
          <div className="p-4">
            <h4 className="text-sm font-semibold text-white truncate" title={nft.name}>
              {nft.name}
            </h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                #{nft.tokenId.length > 6 ? nft.tokenId.slice(0, 6) + '...' : nft.tokenId}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                {nft.contractType}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};