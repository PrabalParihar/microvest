"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  Wallet,
  Users,
  LineChart,
  Shield,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Import Web3Auth and Firebase
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

const VentureCatalystDAO = () => {
  // State variables
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Web3Auth and Firebase configurations
  const clientId =
    "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // Replace with your Web3Auth Client ID
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
    apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
    authDomain: "web3auth-oauth-logins.firebaseapp.com",
    projectId: "web3auth-oauth-logins",
    storageBucket: "web3auth-oauth-logins.appspot.com",
    messagingSenderId: "461819774167",
    appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
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

        if (web3authInstance.status === ADAPTER_EVENTS.CONNECTED) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error("Web3Auth Initialization Error:", error);
      }
    };

    initWeb3Auth();
  }, []);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.pageYOffset / totalScroll) * 100;
      setScrollProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        verifierId: (payload as any).sub,
        idToken,
      });

      if (web3authProvider) {
        setLoggedIn(true);
        setProvider(web3authProvider);
        console.log("Logged in successfully!");
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
      console.log("Logged out successfully!");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const navItems = ["Home", "Features", "Stats", "Join"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-900/80 backdrop-blur-md z-40 transition-all duration-300">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg rotate-45 transform transition-transform hover:rotate-90">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600" />
              </div>
              <h1 className="text-2xl font-bold">Venture Catalyst</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Connect Wallet */}
            <div className="hidden md:block">
              {!loggedIn ? (
                <button
                  onClick={login}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                >
                  Connect Wallet <Wallet size={20} />
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className="text-green-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Connected
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 ${
              isMenuOpen ? "max-h-48" : "max-h-0"
            } overflow-hidden`}
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item}
                  className="block w-full text-left text-gray-300 hover:text-white py-2"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block animate-bounce mb-4">
              <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-sm">
                Now Live on Mainnet
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Democratizing
              <div className="relative inline-block ml-3">
                <span className="text-blue-400">Venture Capital</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-blue-400/30 rounded-full" />
              </div>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Join the future of decentralized investing. Pool resources, vote
              on investments, and share in the success together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg flex items-center justify-center gap-2 transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
                Join DAO <ArrowRight size={20} />
              </button>
              <button className="border border-blue-600 hover:bg-blue-600/10 px-8 py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/25">
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 md:mt-0">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="pt-6">
                <Users className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Community Governed</h3>
                <p className="text-gray-400">
                  Democratic decision-making on all investments
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="pt-6">
                <LineChart className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Transparent Returns</h3>
                <p className="text-gray-400">
                  Track performance in real-time
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="pt-6">
                <Shield className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Secure Protocol</h3>
                <p className="text-gray-400">
                  Built on battle-tested smart contracts
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10">
              <CardContent className="pt-6">
                <Wallet className="w-12 h-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-bold mb-2">Low Barriers</h3>
                <p className="text-gray-400">Start investing with any amount</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "$12M+", label: "Total Value Locked" },
              { value: "1,200+", label: "DAO Members" },
              { value: "32", label: "Portfolio Companies" },
              { value: "24%", label: "Avg. Annual Return" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg transform transition-all hover:scale-105"
              >
                <h4 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </h4>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        </div>
        <div className="relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join the Future of Investing?
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Connect your wallet to start participating in community-driven
            venture investments today.
          </p>
          <button
            onClick={login}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg flex items-center gap-2 mx-auto transform transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            {loggedIn ? "Go to Dashboard" : "Launch App"} <ArrowRight size={20} />
          </button>
          <div className="mt-8 animate-bounce">
            <ChevronDown size={24} className="mx-auto text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureCatalystDAO;