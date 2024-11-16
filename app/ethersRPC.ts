// lib/ethersRPC.ts
import type { IProvider } from "@web3auth/base";
import { ethers } from "ethers";

class EthersRPC {
  static async getChainId(provider: IProvider): Promise<string> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const networkDetails = await ethersProvider.getNetwork();
      return networkDetails.chainId.toString();
    } catch (error) {
      console.error("Error getting chain ID:", error);
      throw error;
    }
  }

  static async getAccounts(provider: IProvider): Promise<string> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      return await signer.getAddress();
    } catch (error) {
      console.error("Error getting accounts:", error);
      throw error;
    }
  }

  static async getBalance(provider: IProvider): Promise<string> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await ethersProvider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }

  static async sendTransaction(
    provider: IProvider,
    to: string,
    amount: string,
    data?: string
  ): Promise<ethers.TransactionResponse> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const fees = await ethersProvider.getFeeData();

      const tx = await signer.sendTransaction({
        to,
        value: ethers.parseEther(amount),
        maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
        maxFeePerGas: fees.maxFeePerGas,
        data: data || "0x",
      });

      return tx;
    } catch (error) {
      console.error("Error sending transaction:", error);
      throw error;
    }
  }

  static async signMessage(
    provider: IProvider,
    message: string = "Hello World"
  ): Promise<string> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      return await signer.signMessage(message);
    } catch (error) {
      console.error("Error signing message:", error);
      throw error;
    }
  }

  static async getContract(
    provider: IProvider,
    address: string,
    abi: ethers.InterfaceAbi
  ): Promise<ethers.Contract> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      return new ethers.Contract(address, abi, signer);
    } catch (error) {
      console.error("Error getting contract:", error);
      throw error;
    }
  }

  // Additional utility methods for MicroVest
  static async createInvestmentPool(
    provider: IProvider,
    contractAddress: string,
    abi: ethers.InterfaceAbi,
    params: {
      symbol: string;
      targetAmount: string;
      minInvestment: string;
      maxInvestment: string;
    }
  ): Promise<ethers.TransactionResponse> {
    try {
      const contract = await this.getContract(provider, contractAddress, abi);
      const tx = await contract.createPool(
        params.symbol,
        ethers.parseEther(params.targetAmount),
        ethers.parseEther(params.minInvestment),
        ethers.parseEther(params.maxInvestment)
      );
      return tx;
    } catch (error) {
      console.error("Error creating investment pool:", error);
      throw error;
    }
  }

  static async invest(
    provider: IProvider,
    contractAddress: string,
    abi: ethers.InterfaceAbi,
    poolId: number,
    amount: string
  ): Promise<ethers.TransactionResponse> {
    try {
      const contract = await this.getContract(provider, contractAddress, abi);
      const tx = await contract.invest(poolId, {
        value: ethers.parseEther(amount)
      });
      return tx;
    } catch (error) {
      console.error("Error investing:", error);
      throw error;
    }
  }

  static async getPoolDetails(
    provider: IProvider,
    contractAddress: string,
    abi: ethers.InterfaceAbi,
    poolId: number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const contract = new ethers.Contract(contractAddress, abi, ethersProvider);
      return await contract.pools(poolId);
    } catch (error) {
      console.error("Error getting pool details:", error);
      throw error;
    }
  }

  static async getUserInvestments(
    provider: IProvider,
    contractAddress: string,
    abi: ethers.InterfaceAbi,
    userAddress: string,
    poolId: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      const contract = new ethers.Contract(contractAddress, abi, ethersProvider);
      return await contract.investments(poolId, userAddress);
    } catch (error) {
      console.error("Error getting user investments:", error);
      throw error;
    }
  }

  static async estimateGas(
    provider: IProvider,
    transaction: ethers.TransactionRequest
  ): Promise<bigint> {
    try {
      const ethersProvider = new ethers.BrowserProvider(provider);
      return await ethersProvider.estimateGas(transaction);
    } catch (error) {
      console.error("Error estimating gas:", error);
      throw error;
    }
  }
}

export default EthersRPC;