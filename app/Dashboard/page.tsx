"use client"
import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { AuthContext } from "../AuthContext";
import EthersRPC from "../ethersRPC";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast"

const CONTRACT_ADDRESS = "0xb05B656dB6cf1c0652B165270B10f86E7D14F378";
const CONTRACT_ABI =  [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_oracle",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_attestation",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "parameter",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "updater",
                "type": "address"
            }
        ],
        "name": "ConfigUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "string",
                "name": "action",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "initiator",
                "type": "address"
            }
        ],
        "name": "EmergencyAction",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "investor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "InvestmentMade",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            }
        ],
        "name": "PoolCreated",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "PRICE_TOLERANCE",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "attestation",
        "outputs": [
            {
                "internalType": "contract MicroVestAttestation",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minInvestment",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxInvestment",
                "type": "uint256"
            }
        ],
        "name": "createPool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            }
        ],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "investor",
                "type": "address"
            }
        ],
        "name": "getInvestmentValue",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "initialValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "profit",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "poolId",
                "type": "uint256"
            }
        ],
        "name": "invest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "oracle",
        "outputs": [
            {
                "internalType": "contract MicroVestOracle",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "poolCounter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "pools",
        "outputs": [
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "targetAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "currentAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "minInvestment",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxInvestment",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "active",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newAdmin",
                "type": "address"
            }
        ],
        "name": "setAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "_paused",
                "type": "bool"
            }
        ],
        "name": "setPaused",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

interface Pool {
  id: number;
  symbol: string;
  targetAmount: string;
  currentAmount: string;
  minInvestment: string;
  maxInvestment: string;
  userInvestment: string;
}

interface PoolFormData {
  symbol: string;
  targetAmount: string;
  minInvestment: string;
  maxInvestment: string;
}

interface PoolDetails {
  active: boolean;
  symbol: string;
  targetAmount: bigint;
  currentAmount: bigint;
  minInvestment: bigint;
  maxInvestment: bigint;
}

export default function Dashboard() {
    const { toast } = useToast()
  const { provider, loggedIn, account, login, logout } = useContext(AuthContext);

  // State Management
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [pools, setPools] = useState<Pool[]>([]);

  // Modal State
  const [isCreatePoolOpen, setIsCreatePoolOpen] = useState<boolean>(false);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState<boolean>(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  // Form State
  const [poolFormData, setPoolFormData] = useState<PoolFormData>({
    symbol: '',
    targetAmount: '',
    minInvestment: '',
    maxInvestment: ''
  });
  const [investAmount, setInvestAmount] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      if (loggedIn && provider) {
        try {
          setIsLoading(true);
          setError(null);
          
          // Get account balance
          const userBalance = await EthersRPC.getBalance(provider);
          setBalance(userBalance);
          
          // Load pools
          await loadPools();
        } catch (err) {
          console.error("Error loading data:", err);
          setError("Failed to load dashboard data");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [loggedIn, provider]);

  const loadPools = async () => {
    try {
      if (!provider) {
        throw new Error("Provider is not initialized");
      }

      // Get the contract instance
      const contract = await EthersRPC.getContract(
        provider,
        CONTRACT_ADDRESS,
        CONTRACT_ABI
      );

      const poolCountBN: bigint = await contract.poolCounter();
      const poolCount: number = Number(poolCountBN);
      const poolsData: Pool[] = [];

      for (let i = 0; i < poolCount; i++) {
        const poolDetails: PoolDetails = await EthersRPC.getPoolDetails(
          provider,
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          i
        );

        if (poolDetails.active) {
          let userInvestmentBN = BigInt(0);
          if (account) {
            userInvestmentBN = await EthersRPC.getUserInvestments(
              provider,
              CONTRACT_ADDRESS,
              CONTRACT_ABI,
              account,
              i
            );
          }

          const userInvestment = userInvestmentBN || BigInt(0);

          poolsData.push({
            id: i,
            symbol: poolDetails.symbol,
            targetAmount: ethers.formatEther(poolDetails.targetAmount),
            currentAmount: ethers.formatEther(poolDetails.currentAmount),
            minInvestment: ethers.formatEther(poolDetails.minInvestment),
            maxInvestment: ethers.formatEther(poolDetails.maxInvestment),
            userInvestment: ethers.formatEther(userInvestment)
          });
        }
      }

      setPools(poolsData);
    } catch (err) {
      console.error("Error loading pools:", err);
      throw err;
    }
  };

  const handleCreatePool = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!provider) {
        throw new Error("Provider is not initialized");
      }

      const tx = await EthersRPC.createInvestmentPool(
        provider,
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        {
          symbol: poolFormData.symbol,
          targetAmount: poolFormData.targetAmount,
          minInvestment: poolFormData.minInvestment,
          maxInvestment: poolFormData.maxInvestment
        }
      );

      toast({
        title: "Creating Pool",
        description: "Please wait while your transaction is being processed...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: "Pool created successfully!",
      });

      await loadPools();
      setIsCreatePoolOpen(false);
      setPoolFormData({
        symbol: '',
        targetAmount: '',
        minInvestment: '',
        maxInvestment: ''
      });
    } catch (err) {
      console.error("Error creating pool:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create pool. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!provider) {
        throw new Error("Provider is not initialized");
      }

      if (selectedPool) {
        const tx = await EthersRPC.invest(
          provider,
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          selectedPool.id,
          investAmount
        );

        toast({
          title: "Processing Investment",
          description: "Please wait while your transaction is being processed...",
        });

        await tx.wait();

        toast({
          title: "Success",
          description: "Investment successful!",
        });

        await loadPools();
        setIsInvestModalOpen(false);
        setInvestAmount('');
        setSelectedPool(null);
      } else {
        throw new Error("No pool selected for investment");
      }
    } catch (err) {
      console.error("Error investing:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Investment failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Auth Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Investment Dashboard</h1>
          {loggedIn && (
            <p className="text-sm text-gray-500">Balance: {balance} ETH</p>
          )}
        </div>
        {!loggedIn ? (
          <Button onClick={login} disabled={isLoading}>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {account?.slice(0, 6)}...{account?.slice(-4)}
            </span>
            <Button  onClick={logout}>
              Disconnect
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : loggedIn ? (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsCreatePoolOpen(true)}>
              Create New Pool
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Investment Pools</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-4">Symbol</th>
                    <th className="pb-4">Target</th>
                    <th className="pb-4">Current</th>
                    <th className="pb-4">Min Investment</th>
                    <th className="pb-4">Max Investment</th>
                    <th className="pb-4">Your Investment</th>
                    <th className="pb-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pools.map((pool) => (
                    <tr key={pool.id} className="border-t">
                      <td className="py-4">{pool.symbol}</td>
                      <td className="py-4">{pool.targetAmount} ETH</td>
                      <td className="py-4">{pool.currentAmount} ETH</td>
                      <td className="py-4">{pool.minInvestment} ETH</td>
                      <td className="py-4">{pool.maxInvestment} ETH</td>
                      <td className="py-4">{pool.userInvestment} ETH</td>
                      <td className="py-4">
                        <Button
                        //   variant="outline"
                        //   size="sm"
                          onClick={() => {
                            setSelectedPool(pool);
                            setIsInvestModalOpen(true);
                          }}
                        >
                          Invest
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl text-gray-600">
            Connect your wallet to view investment pools
          </h2>
        </div>
      )}

      {/* Create Pool Modal */}
      <Dialog open={isCreatePoolOpen} onOpenChange={setIsCreatePoolOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Investment Pool</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreatePool} className="space-y-4">
            <div className="space-y-2">
              <Label>Pool Symbol</Label>
              <Input
                value={poolFormData.symbol}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPoolFormData((prev) => ({
                    ...prev,
                    symbol: e.target.value,
                  }))
                }
                placeholder="ETH-POOL"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Target Amount (ETH)</Label>
              <Input
                type="number"
                step="0.01"
                value={poolFormData.targetAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPoolFormData((prev) => ({
                    ...prev,
                    targetAmount: e.target.value,
                  }))
                }
                placeholder="10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Min Investment (ETH)</Label>
              <Input
                type="number"
                step="0.01"
                value={poolFormData.minInvestment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPoolFormData((prev) => ({
                    ...prev,
                    minInvestment: e.target.value,
                  }))
                }
                placeholder="0.1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Max Investment (ETH)</Label>
              <Input
                type="number"
                step="0.01"
                value={poolFormData.maxInvestment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPoolFormData((prev) => ({
                    ...prev,
                    maxInvestment: e.target.value,
                  }))
                }
                placeholder="2"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Pool"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invest Modal */}
      <Dialog open={isInvestModalOpen} onOpenChange={setIsInvestModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invest in Pool</DialogTitle>
          </DialogHeader>
          {selectedPool && (
            <form onSubmit={handleInvest} className="space-y-4">
              <div className="space-y-2">
                <Label>Pool Details</Label>
                <div className="text-sm text-gray-500">
                  <p>Symbol: {selectedPool.symbol}</p>
                  <p>Min Investment: {selectedPool.minInvestment} ETH</p>
                  <p>Max Investment: {selectedPool.maxInvestment} ETH</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Investment Amount (ETH)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={selectedPool.minInvestment}
                  max={selectedPool.maxInvestment}
                  value={investAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInvestAmount(e.target.value)
                  }
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Investing..." : "Confirm Investment"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}