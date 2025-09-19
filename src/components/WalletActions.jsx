import React, { useState, useEffect } from "react";
import useConnectWallet from "../hooks/useConnectWallet"; // Updated hook
import ERC20ABI from "../abis/ERC20.json";

export default function WalletActions() {
  const {
    connectWallet,
    web3,
    address,
    isConnected,
    isConnecting,
    networkName,
    switchToNetwork, // <- cleaner method from hook
  } = useConnectWallet();

  const [balances, setBalances] = useState({});
  const [transferAmount, setTransferAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [selectedToken, setSelectedToken] = useState("RAAS");
  const [refreshingBalances, setRefreshingBalances] = useState(false);

  // Token info: address + required network
  const TOKENS = {
    RAAS: {
      address: "xdc7e88Fb6dC8E1Df1099e92a806cEfC58f5F466993",
      network: {
        chainId: "0x35",
        name: "XDC Mainnet",
        rpcUrls: ["https://rpc.xinfin.network/"],
        nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
        blockExplorerUrls: ["https://xdcscan.io/"],
      },
    },
    RAAK: {
      address: "xdc55CDF6069393F76E42323C046baEF62a818EF6d1",
      network: {
        chainId: "0x35",
        name: "XDC Mainnet",
        rpcUrls: ["https://rpc.xinfin.network/"],
        nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
        blockExplorerUrls: ["https://xdcscan.io/"],
      },
    },
    USDT_XDC: {
      address: "xdcD4b5f10d61916bd6e0860144a91ac658de8a1437",
      network: {
        chainId: "0x35",
        name: "XDC Mainnet",
        rpcUrls: ["https://rpc.xinfin.network/"],
        nativeCurrency: { name: "XDC", symbol: "XDC", decimals: 18 },
        blockExplorerUrls: ["https://xdcscan.io/"],
      },
    },
  };

  // Fetch balances
  const fetchBalances = async () => {
    if (!web3 || !address) return;
    setRefreshingBalances(true);
    try {
      const newBalances = {};
      for (const [symbol, token] of Object.entries(TOKENS)) {
        const tokenContract = new web3.eth.Contract(ERC20ABI, token.address);
        const balance = await tokenContract.methods.balanceOf(address).call();
        newBalances[symbol] = web3.utils.fromWei(balance);
      }
      setBalances(newBalances);
    } catch (err) {
      console.error("Failed to fetch balances:", err);
    } finally {
      setRefreshingBalances(false);
    }
  };

  // Auto-refresh balances on wallet connection
  useEffect(() => {
    if (isConnected) fetchBalances();
  }, [isConnected, web3, address]);

  const handleTransfer = async () => {
    if (!web3 || !address) return alert("Wallet not connected!");
    if (!recipient || !transferAmount) return alert("Recipient & amount required!");

    setTxStatus("Preparing transfer...");

    try {
      const token = TOKENS[selectedToken];
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

      // Switch network if needed
      if (currentChainId !== token.network.chainId) {
        setTxStatus(`Switching network to ${token.network.name}...`);
        await switchToNetwork(token.network);
        setTxStatus(`Network switched to ${token.network.name}. Proceeding with transfer...`);
      }

      const tokenContract = new web3.eth.Contract(ERC20ABI, token.address);
      const amountWei = web3.utils.toWei(transferAmount.toString());

      const tx = await tokenContract.methods.transfer(recipient, amountWei).send({ from: address });
      console.log(tx);
      setTxStatus("Transaction successful ✅");

      // Refresh balances after transfer
      await fetchBalances();
    } catch (error) {
      console.error(error);
      if (error.code === 4001) setTxStatus("Transaction rejected by user ❌");
      else setTxStatus(`Transaction failed ❌: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-xl shadow-md">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
            isConnecting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div>
          <p className="mb-2 text-gray-700 font-medium">Connected Address:</p>
          <p className="mb-1 text-gray-800 font-mono">{address}</p>
          <p className="mb-4 text-gray-500 text-sm">Network: {networkName}</p>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Balances:</h3>
            {refreshingBalances ? (
              <p className="text-gray-500 text-sm">Refreshing balances...</p>
            ) : (
              <ul className="space-y-1">
                {Object.entries(balances).map(([symbol, value]) => (
                  <li key={symbol} className="text-gray-800">
                    {symbol}: {value}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={fetchBalances}
              className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
              disabled={!isConnected || isConnecting}
            >
              Refresh Balances
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Test Transfer:</h3>
            <input
              type="text"
              placeholder="Recipient address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="border px-2 py-1 rounded mr-2 w-64"
              disabled={!isConnected}
            />
            <input
              type="number"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="border px-2 py-1 rounded mr-2 w-32"
              disabled={!isConnected}
            />
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="border px-2 py-1 rounded mr-2"
              disabled={!isConnected}
            >
              {Object.keys(TOKENS).map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
            <button
              onClick={handleTransfer}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
              disabled={!isConnected}
            >
              Send
            </button>
          </div>

          {txStatus && <p className="text-sm text-gray-600">{txStatus}</p>}
        </div>
      )}
    </div>
  );
}
