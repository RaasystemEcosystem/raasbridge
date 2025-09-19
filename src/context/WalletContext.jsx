// src/context/WalletContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Web3 from "web3";
import ERC20ABI from "../abis/ERC20.json";

const WalletContext = createContext();

const TOKEN_ADDRESSES = {
  RAAS: "xdc7e88Fb6dC8E1Df1099e92a806cEfC58f5F466993",
  RAAK: "xdc55CDF6069393F76E42323C046baEF62a818EF6d1",
  USDT_XDC: "xdcD4b5f10d61916bd6e0860144a91ac658de8a1437",
};

// XDC Chain ID
const XDC_CHAIN_ID = "0x60"; // 96 decimal = XDC Mainnet

export const WalletProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [balances, setBalances] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalances = async (web3Instance = web3, account = address) => {
    if (!web3Instance || !account) return;
    const newBalances = {};
    for (const [symbol, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
      try {
        const tokenContract = new web3Instance.eth.Contract(ERC20ABI, tokenAddress);
        const rawBalance = await tokenContract.methods.balanceOf(account).call();
        newBalances[symbol] = parseFloat(web3Instance.utils.fromWei(rawBalance));
      } catch (err) {
        console.error(`Error fetching ${symbol} balance:`, err);
        newBalances[symbol] = 0;
      }
    }
    setBalances(newBalances);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask or XDC wallet not found.");
    if (isConnecting) return; // Prevent multiple calls

    setIsConnecting(true);
    try {
      // Ensure XDC Network
      if (window.ethereum.chainId !== XDC_CHAIN_ID) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: XDC_CHAIN_ID }],
        });
      }

      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setAddress(accounts[0]);
      setIsConnected(true);

      await fetchBalances(web3Instance, accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert(err.message || "Wallet connection failed");
    } finally {
      setIsConnecting(false);
    }
  };

  // Listen for account/network changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
        fetchBalances(web3, accounts[0]);
      } else {
        setAddress(null);
        setIsConnected(false);
      }
    };

    const handleChainChanged = (chainId) => {
      if (chainId !== XDC_CHAIN_ID) {
        alert("Please switch to XDC Network in MetaMask!");
        setIsConnected(false);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [web3]);

  return (
    <WalletContext.Provider
      value={{
        connectWallet,
        web3,
        address,
        balances,
        isConnected,
        isConnecting,
        fetchBalances,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
