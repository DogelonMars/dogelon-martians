import { useEffect, useState, createContext, useContext } from "react";
import { ethers } from "ethers";
import { JsonRpcProvider, InfuraProvider } from "@ethersproject/providers";
import Web3Modal from "web3modal";
import { web3ModalProviderOptions } from "./web3ModalProviderOptions";

const offlineProvider =
  process.env.REACT_APP_DEV === 'true' ? new JsonRpcProvider('http://localhost:8545')
  : new InfuraProvider('mainnet', process.env.REACT_APP_INFURA_KEY)

offlineProvider.OFFLINE = true

export const Web3ModalContext = createContext({
  provider: null,
  address: null,
  chainId: 1,
  connect: () => {},
  disconnect: () => {},
})

const web3Modal = new Web3Modal({
  network: "mainnet",
  providerOptions: web3ModalProviderOptions,
  cacheProvider: true,
  theme: "dark",
});

export function Web3ModalProvider({ children }) {
  const [instance, setInstance] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [address, setAddress] = useState(null)
  const [provider, setProvider] = useState(offlineProvider)

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', connect)
      window.ethereum.on('chainIdChanged', connect)
      window.ethereum.on('accountsChanged', handleAccountsChanged)
    }
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener('chainChanged', connect)
        window.ethereum.removeListener('chainIdChanged', connect)
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  useEffect(() => {
    if (web3Modal.cachedProvider === 'injected' && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts.length) connect()
        })
        .catch((e) => {
          console.error(e)
        })
    }
  }, [])

  async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      return disconnect()
        .catch((e) => {
          console.error(e)
        })
    }
    connect()
      .catch((e) => {
        console.error(e)
      })
  }

  async function connect() {
    console.log('connect')
    const web3ModalInstance = await web3Modal.connect()
    const _provider = new ethers.providers.Web3Provider(web3ModalInstance)
    const chain = await _provider.getNetwork()
    const accounts = await _provider.listAccounts()
    setProvider(_provider)
    setChainId(chain.chainId)
    setAddress(accounts[0])
  }

  async function disconnect() {
    console.log('disconnect')
    if (instance && instance.currentProvider && instance.currentProvider.close) {
      await instance.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setInstance(null)
    setAddress(null)
    setChainId(null)
    setProvider(offlineProvider)
  }

  return (
    <Web3ModalContext.Provider value={{ provider, address, chainId, connect, disconnect }}>
      {children}
    </Web3ModalContext.Provider>
  )
}

export function useWeb3Modal() {
  return useContext(Web3ModalContext)
}
