import { ethers } from 'ethers';
import RabexABI from '../abis/Rabex.json';

const RABEX_CONTRACT_ADDRESS = '0xYourRabexContractAddress'; // Replace with your actual address

const getRabexContract = () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(RABEX_CONTRACT_ADDRESS, RabexABI, signer);
};

export default getRabexContract;
