// // components/PoolList.tsx
// import { useState, useEffect } from 'react';
// import { IProvider } from "@web3auth/base";
// import { ethers } from 'ethers';
// import { useToast } from '@/components/ui/use-toast';
// import { MICROVEST_ABI } from '@/constants/abis';
// import { MICROVEST_ADDRESS } from '@/config/addresses';
// import { Pool } from '@/types';

// interface PoolListProps {
//   provider: IProvider | null;
//   userAddress: string | null;
// }

// export function PoolList({ provider, userAddress }: PoolListProps) {
//   const [pools, setPools] = useState<Pool[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     fetchPools();
//   }, [provider]);

//   const fetchPools = async () => {
//     if (!provider) return;

//     try {
//       const ethersProvider = new ethers.providers.Web3Provider(provider as any);
//       const contract = new ethers.Contract(MICROVEST_ADDRESS, MICROVEST_ABI, ethersProvider);
      
//       const poolCount = await contract.poolCounter();
//       const poolsData = [];

//       for (let i = 1; i <= poolCount.toNumber(); i++) {
//         const pool = await contract.pools(i);
//         poolsData.push({ id: i, ...pool });
//       }

//       setPools(poolsData);
//     } catch (error) {
//       console.error('Error fetching pools:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch investment pools",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const invest = async (poolId: number, amount: string) => {
//     if (!provider) {
//       toast({
//         title: "Error",
//         description: "Please connect your wallet",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const ethersProvider = new ethers.providers.Web3Provider(provider as any);
//       const signer = ethersProvider.getSigner();
//       const contract = new ethers.Contract(MICROVEST_ADDRESS, MICROVEST_ABI, signer);

//       const tx = await contract.invest(poolId, {
//         value: ethers.utils.parseEther(amount)
//       });

//       toast({
//         title: "Investment Pending",
//         description: "Please wait for confirmation...",
//       });

//       await tx.wait();

//       toast({
//         title: "Success",
//         description: "Investment successful!",
//       });

//       fetchPools(); // Refresh pools
//     } catch (error) {
//       console.error('Error investing:', error);
//       toast({
//         title: "Error",
//         description: "Investment failed",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="animate-pulse space-y-4">
//         <div className="h-32 bg-gray-200 rounded-lg"></div>
//         <div className="h-32 bg-gray-200 rounded-lg"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold">Investment Pools</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {pools.map((pool) => (
//           <PoolCard
//             key={pool.id}
//             pool={pool}
//             onInvest={invest}
//             userAddress={userAddress}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }