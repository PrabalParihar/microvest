// // components/PoolCard.tsx
// interface PoolCardProps {
//     pool: Pool;
//     onInvest: (poolId: number, amount: string) => Promise<void>;
//     userAddress: string | null;
//   }
  
//   export function PoolCard({ pool, onInvest, userAddress }: PoolCardProps) {
//     const [amount, setAmount] = useState('');
//     const [investing, setInvesting] = useState(false);
//     const progress = (Number(pool.currentAmount) / Number(pool.targetAmount)) * 100;
  
//     const handleInvest = async () => {
//       if (!amount) return;
//       setInvesting(true);
//       try {
//         await onInvest(pool.id, amount);
//         setAmount('');
//       } finally {
//         setInvesting(false);
//       }
//     };
  
//     return (
//       <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="text-lg font-semibold">{pool.symbol}</h3>
//             <p className="text-sm text-gray-500">
//               Created by {pool.creator === userAddress ? 'You' : shortenAddress(pool.creator)}
//             </p>
//           </div>
//           <span className={`px-2 py-1 rounded-full text-sm ${
//             pool.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//           }`}>
//             {pool.active ? 'Active' : 'Closed'}
//           </span>
//         </div>
  
//         <div className="space-y-2">
//           <div className="flex justify-between text-sm">
//             <span>Progress</span>
//             <span>{progress.toFixed(1)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-600 rounded-full h-2"
//               style={{ width: `${Math.min(progress, 100)}%` }}
//             ></div>
//           </div>
//         </div>
  
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <p className="text-gray-500">Target</p>
//             <p className="font-semibold">{ethers.utils.formatEther(pool.targetAmount)} ETH</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Min Investment</p>
//             <p className="font-semibold">{ethers.utils.formatEther(pool.minInvestment)} ETH</p>
//           </div>
//         </div>
  
//         {pool.active && (
//           <div className="space-y-2">
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Amount to invest (ETH)"
//               className="w-full px-3 py-2 border rounded-md"
//               step="0.01"
//             />
//             <button
//               onClick={handleInvest}
//               disabled={investing || !amount}
//               className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
//             >
//               {investing ? 'Investing...' : 'Invest'}
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   }