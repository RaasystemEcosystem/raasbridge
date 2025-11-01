// deployRBT.js
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
const bytecode = fs.readFileSync(path.join("./RBT_BYTECODE.txt"), "utf8").trim();

// -------------------------
// 3. Deploy Contract
// -------------------------
async function deploy() {
  try {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const initialSupply = ethers.parseUnits("1000000", 18); // 1M RBT
    const ownerAddress = wallet.address;

    console.log("🚀 Deploying RaasBridgeToken...");

    // Send deployment transaction
    const contract = await factory.deploy(initialSupply, ownerAddress);

    console.log("⏳ Waiting for contract deployment to be mined...");
    await contract.waitForDeployment();

    console.log("✅ Contract deployed successfully!");
    console.log("📄 Contract Address:", await contract.getAddress());
  } catch (err) {
    console.error("❌ Deployment failed:", err);
  }
}

deploy();
