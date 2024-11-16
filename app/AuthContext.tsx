// AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  IProvider,
  WEB3AUTH_NETWORK,
} from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { decodeToken, Web3Auth } from "@web3auth/single-factor-auth";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";


interface AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  loggedIn: boolean;
  account: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  web3auth: null,
  provider: null,
  loggedIn: false,
  account: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  // Web3Auth and Firebase configurations
  const clientId = "YOUR_WEB3AUTH_CLIENT_ID"; // Replace with your Web3Auth Client ID
  const verifier = "w3a-firebase-demo";

  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
    projectId: "YOUR_FIREBASE_PROJECT_ID",
    storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
    messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
          privateKeyProvider,
        });

        await web3authInstance.init();
        setWeb3auth(web3authInstance);
        setProvider(web3authInstance.provider);

        if (web3authInstance.status === ADAPTER_EVENTS.CONNECTED && web3authInstance.provider) {
            setLoggedIn(true);
            const accounts = await web3authInstance.provider.request({
              method: "eth_accounts",
            }) as string[];  // Type assertion for accounts
            setAccount(accounts[0]);
          }
      } catch (error) {
        console.error("Web3Auth Initialization Error:", error);
      }
    };

    initWeb3Auth();
  }, []);

  // Sign in with Google using Firebase
  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log("Firebase Auth Response:", res);
      return res;
    } catch (err) {
      console.error("Firebase Auth Error:", err);
      throw err;
    }
  };

  // Login function
  const login = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized yet");
      return;
    }

    try {
      // Sign in with Firebase
      const loginRes = await signInWithGoogle();
      const idToken = await loginRes.user.getIdToken(true);
      const { payload } = decodeToken(idToken);

      // Connect with Web3Auth
      const web3authProvider = await web3auth.connect({
        verifier,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        verifierId: (payload as any).sub,
        idToken,
      });

      if (web3authProvider) {
        setLoggedIn(true);
        setProvider(web3authProvider);
        console.log("Logged in successfully!");
    
        const accounts = (await web3authProvider.request({
            method: "eth_accounts",
        })) as string[];
    
        if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
        }
    }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  // Logout function
  const logout = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized yet");
      return;
    }
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setAccount(null);
      console.log("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ web3auth, provider, loggedIn, account, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};