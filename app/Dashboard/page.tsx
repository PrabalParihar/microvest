// // components/Dashboard.tsx
// import { useState, useEffect } from 'react';
// import { IProvider } from "@web3auth/base";
// import { ethers } from 'ethers';
// import { PoolList } from './PoolList';
// import { CreatePoolModal } from './CreatePoolModal';
// import { MICROVEST_ABI } from '@/constants/abis';
// import { MICROVEST_ADDRESS } from '@/config/addresses';
// import { useToast } from '@/components/ui/use-toast';
// import RPC from '../ethersRPC';

// interface DashboardProps {
//   provider: IProvider | null;
//   userAddress: string | null;
// }

// export function Dashboard({ provider, userAddress }: DashboardProps) {
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [pools, setPools] = useState([]);
//   const [balance, setBalance] = useState<string>('0');
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (provider) {
//         try {
//           const bal = await RPC.getBalance(provider);
//           setBalance(ethers.utils.formatEther(bal));
//         } catch (error) {
//           console.error('Error fetching balance:', error);
//         }
//       }
//     };

//     fetchBalance();
//   }, [provider]);

//   const createPool = async (data: any) => {
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

//       const tx = await contract.createPool(
//         data.symbol,
//         ethers.utils.parseEther(data.targetAmount),
//         ethers.utils.parseEther(data.minInvestment),
//         ethers.utils.parseEther(data.maxInvestment)
//       );

//       toast({
//         title: "Creating Pool",
//         description: "Please wait for the transaction to be confirmed",
//       });

//       await tx.wait();

//       toast({
//         title: "Success",
//         description: "Pool created successfully",
//       });

//       setIsCreateModalOpen(false);
//       // Refresh pools
//       fetchPools();
//     } catch (error) {
//       console.error('Error creating pool:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create pool",
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchPools = async () => {
//     if (!provider) return;

//     try {
//       const ethersProvider = new ethers.providers.Web3Provider(provider as any);
//       const contract = new ethers.Contract(MICROVEST_ADDRESS, MICROVEST_ABI, ethersProvider);

//       // Implement pool fetching logic
//       // This will depend on your contract implementation
//     } catch (error) {
//       console.error('Error fetching pools:', error);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Balance & Actions */}
//       <div className="bg-white shadow rounded-lg p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <h2 className="text-sm font-medium text-gray-500">Your Balance</h2>
//             <p className="mt-1 text-3xl font-semibold text-gray-900">
//               {balance} ETH
//             </p>
//           </div>
//           <div className="flex items-center justify-end">
//             <button
//               onClick={() => setIsCreateModalOpen(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//             >
//               Create Pool
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Pool List */}
//       <PoolList 
//         pools={pools} 
//         provider={provider}
//         userAddress={userAddress}
//       />

//       {/* Create Pool Modal */}
//       <CreatePoolModal
//         isOpen={isCreateModalOpen}
//         onClose={() => setIsCreateModalOpen(false)}
//         onSubmit={createPool}
//       />
//     </div>
//   );
// }