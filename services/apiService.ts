import { RewardResponse, NFT } from '../types';

export const claimReward = async (address: string): Promise<RewardResponse> => {
  try {
    const response = await fetch("/api/claim-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to claim reward");
    }
    
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
};

export const fetchNFTs = async (address: string): Promise<NFT[]> => {
  try {
    const response = await fetch('https://base-indexer.sequence.app/rpc/Indexer/GetTokenBalances', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': 'AQAAAAAAALpwcROtu7ivlzVZjjSTDiNljf0'
      },
      body: JSON.stringify({
        accountAddress: address,
        includeMetadata: true
      })
    });

    const data = await response.json();

    if (data.balances) {
      return data.balances
        .filter((balance: any) => balance.tokenMetadata?.image) // Filter for items with images
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