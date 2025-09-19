// src/utils/loadContract.js
import { ethers } from "ethers";
import Raaskoin from "../abi/Raaskoin.json";
import Raastoken from "../abi/Raastoken.json";
import Rabex from "../abi/Rabex.json";
import Oracle from "../abi/GoldPriceOracle.json";

const CONTRACTS = {
  raaskoin: Raaskoin,
  raastoken: Raastoken,
  rabex: Rabex,
  oracle: Oracle,
};

export async function loadContract(name, providerOrSigner) {
  const contractData = CONTRACTS[name];
  if (!contractData) throw new Error(`Unknown contract: ${name}`);

  const network = await providerOrSigner.provider.getNetwork();
  const networkData = contractData.networks?.[network.chainId];

  if (!networkData) {
    alert(`${name} contract not deployed on this network (Chain ID: ${network.chainId})`);
    return null;
  }

  return new ethers.Contract(networkData.address, contractData.abi, providerOrSigner);
}
