import Web3 from "web3";
import { useState, useEffect } from "react";

// Persistent lock to prevent multiple eth_requestAccounts calls
let walletRequestInProgress = false;

export default function useConnectWallet() {
  const [web3, setWeb3] = useState(null);
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState("");
  const [currentChainId, setCurrentChainId] = useState("");

  const NETWORKS = {
    MAINNET: {
      chainId: "0x35", // 53 decimal
      name: "XDC Mainnet",
      rpcUrls: ["https://rpc.xinfin.network/"],
      nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
      blockExplorerUrls: ["https://xdcscan.io/"],
    },
    APOTHEM: {
      chainId: "0x60", // 96 decimal
      name: "XDC Apothem Testnet",
      rpcUrls: ["https://apothem.xinfin.network/"],
      nativeCurrency: { name: "TXDC", symbol: "TXDC", decimals: 18 },
      blockExplorerUrls: ["https://apothem.xdcscan.io/"],
    },
  };

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case NETWORKS.MAINNET.chainId:
        return NETWORKS.MAINNET.name;
      case NETWORKS.APOTHEM.chainId:
        return NETWORKS.APOTHEM.name;
      default:
        return `Unknown Network (${chainId})`;
    }
  };

  const addOrSwitchNetwork = async (network) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.chainId,
                chainName: network.name,
                rpcUrls: network.rpcUrls,
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: network.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      } else {
        console.error("Failed to switch network:", switchError);
      }
    }
  };

  // Helper to switch network and update state
  const switchToNetwork = async (network) => {
    if (!network || !network.chainId) return;
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId !== network.chainId) {
      await addOrSwitchNetwork(network);
      setCurrentChainId(network.chainId);
      setNetworkName(getNetworkName(network.chainId));
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask/XDC wallet not found");
      return;
    }

    if (walletRequestInProgress) {
      alert("Wallet connection already in progress. Please wait...");
      return;
    }

    walletRequestInProgress = true;
    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      let chainId = await window.ethereum.request({ method: "eth_chainId" });

      if (![NETWORKS.MAINNET.chainId, NETWORKS.APOTHEM.chainId].includes(chainId)) {
        await addOrSwitchNetwork(NETWORKS.MAINNET);
        chainId = await window.ethereum.request({ method: "eth_chainId" });
      }

      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setAddress(accounts[0]);
      setIsConnected(true);
      setNetworkName(getNetworkName(chainId));
      setCurrentChainId(chainId);

      console.log(`✅ Connected to ${getNetworkName(chainId)}:`, accounts[0]);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert(`Wallet connection failed: ${err.message || err}`);
    } finally {
      walletRequestInProgress = false;
      setIsConnecting(false);
    }
  };

  // Auto-reconnect if wallet already authorized
  useEffect(() => {
    const tryAutoReconnect = async () => {
      if (!window.ethereum) return;
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        let chainId = await window.ethereum.request({ method: "eth_chainId" });
        if (![NETWORKS.MAINNET.chainId, NETWORKS.APOTHEM.chainId].includes(chainId)) {
          await addOrSwitchNetwork(NETWORKS.MAINNET);
          chainId = await window.ethereum.request({ method: "eth_chainId" });
        }
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        setAddress(accounts[0]);
        setIsConnected(true);
        setNetworkName(getNetworkName(chainId));
        setCurrentChainId(chainId);
        console.log(`🔄 Auto-reconnected to ${getNetworkName(chainId)}:`, accounts[0]);
      }
    };
    tryAutoReconnect();
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("chainChanged", async (chainId) => {
      setNetworkName(getNetworkName(chainId));
      setCurrentChainId(chainId);
      if (![NETWORKS.MAINNET.chainId, NETWORKS.APOTHEM.chainId].includes(chainId)) {
        await addOrSwitchNetwork(NETWORKS.MAINNET);
      }
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", (accounts) => {
      setAddress(accounts[0] || null);
      setIsConnected(!!accounts[0]);
    });
  }, []);

  return {
    connectWallet,
    web3,
    address,
    isConnected,
    isConnecting,
    networkName,
    currentChainId,
    addOrSwitchNetwork,
    switchToNetwork,
  };
}
