// estimateRBTFee.js
import { ethers } from "ethers";
import fs from "fs";
import path from "path";

// -------------------------
// 1. Provider & Wallet
// -------------------------
const XDC_RPC = "https://rpc.apothem.network"; // Apothem Testnet
const provider = new ethers.JsonRpcProvider(XDC_RPC);

// Replace with your wallet private key (keep it safe!)
const PRIVATE_KEY = "0x021c5d0af13907aa645fc218446d3b6f13d4123680e21fe480bce8675ef4338a";
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// -------------------------
// 2. Load ABI & Bytecode
// -------------------------
const abi = JSON.parse(fs.readFileSync(path.join("./RBT_ABI.json"), "utf8"));

// Make sure the bytecode is a single line string starting with 0x
const bytecode = fs.readFileSync(path.join("./RBT_BYTECODE.txt"), "utf8").trim();

// -------------------------
// 3. Estimate Gas
// -------------------------
async function estimate() {
  try {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const initialSupply = ethers.parseUnits("1000000", 18); // 1M RBT
    const ownerAddress = wallet.address;

    // Estimate gas for deployment
    const gasEstimate = await factory.estimateGas.deploy(initialSupply, ownerAddress);
    console.log("✅ Estimated Gas:", gasEstimate.toString());

    // Get current gas price and calculate fee in TXDC
    const feeData = await provider.getFeeData();
    const gasPrice = feeData.gasPrice ?? ethers.parseUnits("1", "gwei"); // fallback

    // Use ethers.BigNumber to multiply correctly
    const feeInTXDC = gasEstimate.mul(gasPrice);
    console.log("💰 Estimated Fee (TXDC):", ethers.formatEther(feeInTXDC));
  } catch (err) {
    console.error("❌ Gas estimation failed:", err);
  }
}

estimate();
