// checkBalance.js
import { ethers } from "ethers";

// Apothem Testnet RPC
const XDC_RPC = "https://rpc.apothem.network";
const provider = new ethers.JsonRpcProvider(XDC_RPC);

// Your wallet private key
const PRIVATE_KEY = "0x021c5d0af13907aa645fc218446d3b6f13d4123680e21fe480bce8675ef4338a";
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

async function main() {
  const address = wallet.address;
  console.log("🔹 Wallet Address:", address);

  const balanceWei = await provider.getBalance(address);
  console.log("🔹 Raw Balance (wei):", balanceWei.toString());

  const balanceXDC = ethers.formatEther(balanceWei);
  console.log("💰 Balance:", balanceXDC, "TXDC");
}

main().catch(console.error);
