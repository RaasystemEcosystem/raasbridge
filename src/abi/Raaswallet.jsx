import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import RaaswalletABI from '../abi/Raaswallet.json';

const RAASWALLET_ADDRESS = '0x9E5A6C7802674B38f2cE7978cB7C3898bBD337DA';

const Raaswallet = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const raaswalletContract = new web3Instance.eth.Contract(RaaswalletABI, RAASWALLET_ADDRESS);

        setWeb3(web3Instance);
        setContract(raaswalletContract);
        setAccount(accounts[0]);
      }
    };
    init();
  }, []);

  const fetchBalance = async () => {
    if (contract && account) {
      try {
        const balanceRaw = await contract.methods.getBalance().call({ from: account });
        const formatted = web3.utils.fromWei(balanceRaw, 'ether');
        setBalance(formatted);
      } catch (error) {
        console.error('Error getting balance:', error);
        alert('Failed to fetch balance.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Raaswallet Contract</h2>
      <p>Connected Wallet: {account}</p>
      <button onClick={fetchBalance} className="bg-green-600 text-white px-4 py-2 rounded mb-2">
        Get Wallet Balance
      </button>
      {balance && <p className="mt-2">Balance: {balance} ETH</p>}
    </div>
  );
};

export default Raaswallet;
