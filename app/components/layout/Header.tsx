// // components/layout/Header.tsx
// import { Web3Auth } from "@web3auth/single-factor-auth";
// import { shortenAddress } from '@/utils/address';

// export const Header = () => {
//   const { isAuthenticated, address, login, logout, isLoading } = new Web3Auth();

//   return (
//     <header className="py-4 px-6 border-b">
//       <div className="container mx-auto flex justify-between items-center">
//         <div className="flex items-center space-x-6">
//           <h1 className="text-2xl font-bold">MicroVest</h1>
//           <nav className="hidden md:flex space-x-4">
//             <a href="/" className="text-gray-600 hover:text-gray-900">Dashboard</a>
//             <a href="/pools" className="text-gray-600 hover:text-gray-900">Pools</a>
//             <a href="/investments" className="text-gray-600 hover:text-gray-900">My Investments</a>
//           </nav>
//         </div>

//         <div>
//           {isAuthenticated ? (
//             <div className="flex items-center space-x-4">
//               <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
//                 {shortenAddress(address || '')}
//               </span>
//               <button
//                 onClick={logout}
//                 className="text-gray-600 hover:text-gray-900"
//               >
//                 Logout
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={login}
//               disabled={isLoading}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
//             >
//               {isLoading ? 'Connecting...' : 'Connect Wallet'}
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };