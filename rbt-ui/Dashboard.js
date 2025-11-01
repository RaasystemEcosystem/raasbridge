// -------------------------
// RBT Dashboard Script
// -------------------------

const RBT_CONTRACT_ADDRESS = "0xac6f694Cc6A174fb9b88CfBe4B0739F6Dce0baD1"; // Your deployed RBT contract
const RBT_ABI = [ /* same ABI as before including Transfer, Mint, Burn events */ ];

const XDC_CHAIN_IDS = { 50: "XDC Mainnet", 51: "Apothem Testnet" };
let provider, signer, rbtContract, currentAccount, decimals, currentNetwork;
let refreshInterval;

// Helper to shorten addresses
const shortAddr = addr => `${addr.slice(0,6)}...${addr.slice(-4)}`;

// -------------------------
// Connect Wallet
// -------------------------
async function connectWallet() {
  if (!window.ethereum) return alert("MetaMask/XDC Wallet required.");
  provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  currentAccount = await signer.getAddress();
  rbtContract = new ethers.Contract(RBT_CONTRACT_ADDRESS, RBT_ABI, signer);
  decimals = await rbtContract.decimals();

  document.getElementById("walletAddress").textContent = shortAddr(currentAccount);
  document.getElementById("walletStatus").textContent = "● Connected";
  document.getElementById("walletStatus").style.color = "#00FF00";

  currentNetwork = await provider.getNetwork();
  document.getElementById("networkStatus").textContent = XDC_CHAIN_IDS[currentNetwork.chainId] || "Unknown Network";

  // Warn if on Mainnet (Real XDC required)
  const networkWarningEl = document.getElementById("networkWarning");
  if (currentNetwork.chainId === 50) {
    networkWarningEl.textContent = "⚠ You are on XDC Mainnet. Real XDC required for transactions. Use Apothem Testnet for testing.";
    networkWarningEl.style.color = "red";
  } else {
    networkWarningEl.textContent = "";
  }

  await loadTokenInfo();
  await loadBalances();
  await loadTransactions();
  setupEventListeners();

  // Auto-refresh every 15 seconds
  if (refreshInterval) clearInterval(refreshInterval);
  refreshInterval = setInterval(async () => {
    await loadBalances();
    await loadTransactions();
  }, 15000);
}

// -------------------------
// Load Token Info
// -------------------------
async function loadTokenInfo() {
  const name = await rbtContract.name();
  const symbol = await rbtContract.symbol();
  const totalSupply = await rbtContract.totalSupply();
  document.getElementById("tokenInfo").textContent =
    `${name} (${symbol}), Total Supply: ${ethers.utils.formatUnits(totalSupply, decimals)} RBT`;
}

// -------------------------
// Load Balances (RBT + XDC)
// -------------------------
async function loadBalances() {
  if (!currentAccount) return;

  // RBT Balance
  const rbtBal = await rbtContract.balanceOf(currentAccount);
  document.getElementById("balance").textContent = ethers.utils.formatUnits(rbtBal, decimals);

  // XDC Balance (for gas)
  const xdcBal = await provider.getBalance(currentAccount);
  let xdcDisplay = ethers.utils.formatUnits(xdcBal, 18);
  document.getElementById("gasWarning").textContent = `XDC Balance: ${xdcDisplay} XDC`;
}

// -------------------------
// Transfer RBT
// -------------------------
async function transferRBT() {
  const recipient = document.getElementById("recipient").value.trim();
  const amount = document.getElementById("amount").value.trim();
  if (!ethers.utils.isAddress(recipient)) return alert("Invalid recipient address!");
  if (!amount || isNaN(amount) || Number(amount) <= 0) return alert("Invalid amount!");
  try {
    const tx = await rbtContract.transfer(recipient, ethers.utils.parseUnits(amount, decimals));
    alert(`Tx sent: ${tx.hash}`);
    await tx.wait();
    alert("✅ Transfer confirmed!");
    await loadBalances();
    await loadTransactions();
  } catch(err) {
    console.error("Transfer failed:", err);
    alert("Transfer failed. Check console for details.");
  }
}

// -------------------------
// Mint RBT (Owner Only)
// -------------------------
async function mintRBT() {
  const to = document.getElementById("mintRecipient").value.trim();
  const amount = document.getElementById("mintAmount").value.trim();
  const warning = document.getElementById("mintWarning");
  warning.textContent = "";

  if (currentNetwork.chainId === 50) {
    warning.textContent = "⚠ You are on XDC Mainnet. Real XDC required for minting. Use Apothem Testnet for testing.";
    warning.style.color = "red";
    return;
  }

  try {
    const ownerAddr = await rbtContract.owner();
    if (ownerAddr.toLowerCase() !== currentAccount.toLowerCase()) {
      warning.textContent = "⚠ You are not the contract owner!";
      return;
    }
  } catch(err) {
    console.error("Owner fetch failed:", err);
    warning.textContent = "Cannot fetch owner. Check console.";
    return;
  }

  if (!ethers.utils.isAddress(to)) return warning.textContent = "Invalid recipient address!";
  if (!amount || isNaN(amount) || Number(amount) <= 0) return warning.textContent = "Invalid amount!";

  try {
    const tx = await rbtContract.mint(to, ethers.utils.parseUnits(amount, decimals));
    alert(`Mint tx sent: ${tx.hash}`);
    await tx.wait();
    alert(`✅ Minted ${amount} RBT to ${to}`);
    await loadBalances();
    await loadTransactions();
  } catch(err) {
    console.error("Mint failed:", err);
    warning.textContent = "Mint failed. Check console.";
  }
}

// -------------------------
// Load Transactions
// -------------------------
async function loadTransactions() {
  const tbody = document.querySelector("#txHistory tbody");
  tbody.innerHTML = "<tr><td colspan='5'>Loading...</td></tr>";
  try {
    const sent = await rbtContract.queryFilter(rbtContract.filters.Transfer(currentAccount, null), -5000, "latest");
    const recv = await rbtContract.queryFilter(rbtContract.filters.Transfer(null, currentAccount), -5000, "latest");
    const minted = await rbtContract.queryFilter(rbtContract.filters.Mint(currentAccount), -5000, "latest");
    const allEvents = [...sent, ...recv, ...minted].sort((a,b)=>b.blockNumber-a.blockNumber);

    if (!allEvents.length) {
      tbody.innerHTML = "<tr><td colspan='5'>No transactions found</td></tr>";
      return;
    }

    tbody.innerHTML = "";
    allEvents.slice(0,10).forEach(evt => {
      const type = evt.args.from?.toLowerCase() === currentAccount.toLowerCase() ? "Sent" : "Received";
      const amt = ethers.utils.formatUnits(evt.args.value, decimals);
      tbody.innerHTML += `<tr>
        <td>${type}</td>
        <td>${shortAddr(evt.args.from || "0x0")}</td>
        <td>${shortAddr(evt.args.to || "0x0")}</td>
        <td>${amt}</td>
        <td><a href="https://xdcscan.io/tx/${evt.transactionHash}" target="_blank" style="color:#FFD700;">View</a></td>
      </tr>`;
    });
  } catch(err) {
    console.error(err);
    tbody.innerHTML = "<tr><td colspan='5'>Error loading transactions</td></tr>";
  }
}

// -------------------------
// Event Listeners
// -------------------------
function setupEventListeners() {
  rbtContract.on("Transfer", async (from, to, value, event) => {
    console.log("Transfer event:", { from, to, value: ethers.utils.formatUnits(value, decimals), tx: event.transactionHash });
    await loadBalances();
    await loadTransactions();
  });

  rbtContract.on("Mint", async (to, value, event) => {
    console.log("Mint event:", { to, value: ethers.utils.formatUnits(value, decimals), tx: event.transactionHash });
    await loadBalances();
    await loadTransactions();
  });

  rbtContract.on("Burn", async (from, value, event) => {
    console.log("Burn event:", { from, value: ethers.utils.formatUnits(value, decimals), tx: event.transactionHash });
    await loadBalances();
    await loadTransactions();
  });
}

// -------------------------
// Button Actions
// -------------------------
document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
document.getElementById("transferBtn").addEventListener("click", transferRBT);
document.getElementById("mintBtn").addEventListener("click", mintRBT);
document.getElementById("loadMore").addEventListener("click", loadTransactions);
