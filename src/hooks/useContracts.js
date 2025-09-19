import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { loadContract } from "../utils/loadContract";

export default function useContracts() {
  const [contracts, setContracts] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert("MetaMask not found!");
        return;
      }

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        const raaskoin = loadContract("raaskoin", signer);
        const raastoken = loadContract("raastoken", signer);
        const rabex = loadContract("rabex", signer);
        const oracle = loadContract("oracle", signer);

        setContracts({ raaskoin, raastoken, rabex, oracle });
        setAccount(userAddress);
      } catch (err) {
        console.error("Error loading contracts:", err);
      }
    };

    init();
  }, []);

  return { ...contracts, account };
}
