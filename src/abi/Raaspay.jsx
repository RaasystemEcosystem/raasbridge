import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import RaaspayABI from '../abi/Raaspay.json';

const RAASPAY_ADDRESS = '0xD7F5D1651C4dFb659abe57E0F946BFfffF1eFf74';

const Raaspay = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const raaspayContract = new web3Instance.eth.Contract(RaaspayABI, RAASPAY_ADDRESS);

        setWeb3(web3Instance);
        setContract(raaspayContract);
        setAccount(accounts[0]);
      }
    };
    init();
  }, []);

  const handleTransfer = async () => {
    if (contract && account && recipient && amount) {
      try {
        const result = await contract.methods.transfer(recipient, web3.utils.toWei(amount, 'ether')).send({ from: account });
        console.log('Transfer successful:', result);
        alert('Transfer successful!');
      } catch (error) {
        console.error('Transfer failed:', error);
        alert('Transfer failed.');
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Raaspay Contract</h2>
      <p>Connected Wallet: {account}</p>
      <input
        type="text"
        placeholder="Recipient Address"
        className="block border p-2 my-2 w-full"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount (in ETH units)"
        className="block border p-2 my-2 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer} className="bg-blue-600 text-white px-4 py-2 rounded">
        Transfer
      </button>
    </div>
  );
};

export default Raaspay;
