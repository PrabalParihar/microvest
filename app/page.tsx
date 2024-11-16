/* eslint-disable @typescript-eslint/no-use-before-define */

"use client";

import { ADAPTER_EVENTS, CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { decodeToken, Web3Auth } from "@web3auth/single-factor-auth";
// IMP START - Auth Provider Login
// Firebase libraries for custom authentication
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential } from "firebase/auth";
import { useEffect, useState } from "react";

// IMP START - Blockchain Calls
import RPC from "./ethersRPC";
// import RPC from "./viemRPC";
// import RPC from "./web3RPC";

const clientId = "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ"; // get from https://dashboard.web3auth.io

const verifier = "w3a-firebase-demo";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget: "https://rpc.ankr.com/eth_sepolia",
  // Avoid using public rpcTarget in production.
  // Use services like Infura, Quicknode etc
  displayName: "Ethereum Sepolia Testnet",
  blockExplorerUrl: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId, // Get your Client ID from Web3Auth Dashboard
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
});


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0nd9YsPLu-tpdCrsXn8wgsWVAiYEpQ_E",
  authDomain: "web3auth-oauth-logins.firebaseapp.com",
  projectId: "web3auth-oauth-logins",
  storageBucket: "web3auth-oauth-logins.appspot.com",
  messagingSenderId: "461819774167",
  appId: "1:461819774167:web:e74addfb6cc88f3b5b9c92",
};

function App() {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Firebase Initialisation
  const app = initializeApp(firebaseConfig);

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.status === ADAPTER_EVENTS.CONNECTED) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const signInWithGoogle = async (): Promise<UserCredential> => {
    try {
      const auth = getAuth(app);
      const googleProvider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = async () => {
    if (!web3auth) {
      uiConsole("web3auth initialised yet");
      return;
    }
    // login with firebase
    const loginRes = await signInWithGoogle();
    // get the id token from firebase
    const idToken = await loginRes.user.getIdToken(true);
    const { payload } = decodeToken(idToken);

    const web3authProvider = await web3auth.connect({
      verifier,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      verifierId: (payload as any).sub,
      idToken,
    });

    if (web3authProvider) {
      setLoggedIn(true);
      setProvider(web3authProvider);
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    uiConsole(user);
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    uiConsole("logged out");
  };

  // Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const address = await RPC.getAccounts(provider);
    uiConsole(address);
  };

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");

    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }

  const loggedInView = (
    <>
      <div className="flex-container">
        <div>
          <button onClick={getUserInfo} className="card">
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className="card">
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className="card">
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className="card">
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className="card">
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className="card">
            Log Out
          </button>
        </div>
      </div>
    </>
  );

  const unloggedInView = (
    <button onClick={login} className="card">
      Login
    </button>
  );

  return (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">
      <a target="_blank" href="https://web3auth.io/docs/sdk/core-kit/sfa-web" rel="noreferrer" className="text-blue-500 hover:underline">
        Web3Auth Single Factor Auth
      </a>{" "}
      & NextJS Quick Start
    </h1>

    <div className="grid gap-4">{loggedIn ? loggedInView : unloggedInView}</div>
  <div id="console" style={{ whiteSpace: "pre-line", overflowY: "auto", maxHeight: "200px" }}>
    <p style={{ whiteSpace: "pre-line" }}></p>
  </div>
</div>
  );
}

export default App;