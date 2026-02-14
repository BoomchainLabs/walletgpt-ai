import { RewardResponse, NFT, TokenBalance } from '../types';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';

const SEQUENCE_INDEXER_URL = 'https://base-indexer.sequence.app/rpc/Indexer/GetTokenBalances';
const PROJECT_ACCESS_KEY = 'AQAAAAAAALpwcROtu7ivlzVZjjSTDiNljf0';

/**
 * Checks if the user is eligible to claim a reward (last claim > 24h ago)
 */
export const checkClaimStatus = async (address: string): Promise<{ canClaim: boolean; lastClaimedAt?: Date; error?: string }> => {
  if (!db) return { canClaim: false, error: "Database not configured" };
  
  try {
    const rewardRef = doc(db, "rewards", address);
    const rewardSnap = await getDoc(rewardRef);

    if (rewardSnap.exists()) {
      const lastClaim = rewardSnap.data().claimedAt;
      const now = new Date();
      const claimedDate = lastClaim.toDate();
      const diffHours = (now.getTime() - claimedDate.getTime()) / (1000 * 60 * 60);

      return {
        canClaim: diffHours >= 24,
        lastClaimedAt: claimedDate
      };
    }
    
    return { canClaim: true };
  } catch (error) {
    console.error("Error checking claim status:", error);
    return { canClaim: false, error: "Failed to check claim status" };
  }
};

export const claimReward = async (address: string): Promise<RewardResponse> => {
  if (!db) {
    return { error: "Database connection unavailable. Please configure Firebase." };
  }

  try {
    const { canClaim } = await checkClaimStatus(address);
    if (!canClaim) {
      return { error: "You've already claimed your daily reward. Please wait 24 hours." };
    }

    const claimTime = Timestamp.now();
    await setDoc(doc(db, "rewards", address), {
      address: address,
      amount: 100,
      claimedAt: claimTime,
      token: 'WGPT'
    });

    return {
      message: "Success! 100 WGPT points have been credited to your profile.",
      claimedAt: claimTime.toDate()
    };

  } catch (error) {
    console.error("Firestore error:", error);
    return { error: "Transaction failed. Please try again later." };
  }
};

export const fetchTokenBalances = async (address: string): Promise<TokenBalance[]> => {
  try {
    const response = await fetch(SEQUENCE_INDEXER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': PROJECT_ACCESS_KEY
      },
      body: JSON.stringify({
        accountAddress: address,
        includeMetadata: true
      })
    });

    const data = await response.json();
    
    if (data.balances) {
      return data.balances.map((b: any) => ({
        contractAddress: b.contractAddress,
        contractType: b.contractType,
        balance: b.balance,
        decimals: b.tokenMetadata?.decimals || 18,
        name: b.tokenMetadata?.name || 'Unknown',
        symbol: b.tokenMetadata?.symbol || '???',
        logo: b.tokenMetadata?.logo
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch token balances:", error);
    return [];
  }
};

export const fetchNFTs = async (address: string): Promise<NFT[]> => {
  try {
    const response = await fetch(SEQUENCE_INDEXER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': PROJECT_ACCESS_KEY
      },
      body: JSON.stringify({
        accountAddress: address,
        includeMetadata: true
      })
    });

    const data = await response.json();

    if (data.balances) {
      return data.balances
        .filter((balance: any) => 
          (balance.contractType === 'ERC721' || balance.contractType === 'ERC1155') && 
          balance.tokenMetadata?.image
        )
        .map((balance: any) => ({
          contractAddress: balance.contractAddress,
          tokenId: balance.tokenID,
          amount: balance.balance,
          contractType: balance.contractType,
          name: balance.tokenMetadata?.name || `Token #${balance.tokenID}`,
          description: balance.tokenMetadata?.description,
          image: balance.tokenMetadata?.image,
        }));
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch NFTs:", error);
    return [];
  }
};