import type { NextPage } from 'next'
import { useState, useEffect } from 'react'

const Home: NextPage = () => {

  const [account, setAccount] = useState('0x000000000');
  const [network, setNetwork] = useState('...')

  useEffect(() => {
    connect();
    handleAccountsChanged();
    handleNetworkChanged();
    return () => {
      window.ethereum.removeAllListeners();
    }
  }, []);

  const connect = async () => {
    const accounts = await window.ethereum
      .request({ method: 'eth_requestAccounts' });
    console.log(accounts);
    setAccount(accounts[0]);
  }

  const handleAccountsChanged = async () => {
    window.ethereum.on('accountsChanged', (newAddress: string) => {
      setAccount(newAddress);
      console.log("Account changed");
    });
  }

  const addToken = async () => {
    try {
      const success = await window.ethereum
        .request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: '0x0165b733e860b1674541BB7409f8a4743A564157',
              symbol: 'DAI',
              decimals: 18,
              image: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=022',              
            },
          },
        })
      if (success)
        alert("Added Token successfully");
      else
        throw Error("Cannot add token to Metamask!");
    }
    catch (error) {
      console.error(error);
    }
  }

  const addNetwork = async () => {
    try {
      const result = await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: "0x60", // A 0x60  => 96 in decimal
          chainName: "Bitkub Chain",
          nativeCurrency: {
            name: "KUB COIN",
            symbol: "KUB",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.bitkubchain.io"],
          blockExplorerUrls: ["https://bkcscan.com"] 
        }],
      });
      if ( result )
        alert("Please check your network!");      
    }
    catch(error) {
      console.error(error);
    }
  }

  const nameNetwork: { [key: string]: string } = {
    "0x1": "Ethereum Mainnet",
    "0x4": "Rinkeby Test Network",
    "0x60": "Bitkub Chain",
  }

  const handleNetworkChanged = async () => {
    window.ethereum.on('chainChanged',  (chainId: string) => {
      console.log("Chain Id", chainId);
      const selectNetwork = nameNetwork[chainId];
      console.log("Network: ", selectNetwork);
      setNetwork(selectNetwork);
    });
  }

  return (
    <>
      <h1>dApp</h1>
      Account: {account} <br />
      Network: {network} <br />
      <hr />
      {/* <button onClick={connect}>Connect</button> <br /> */}
      <button onClick={addToken}>Add token</button> <br />
      <button onClick={addNetwork}>Add Network</button> <br />
    </>
  )
}

export default Home
