import WalletConnectProvider from "@walletconnect/web3-provider"
import { WalletLink } from 'walletlink'

export const web3ModalProviderOptions = {
  'walletlink': {
    display: {
      name: 'WalletLink',
      logo: 'cb.png',
      description: 'Scan with WalletLink to connect',
    },
    options: {
      appName: 'Dogelon Martians',
      networkUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`,
      chainId: 1,
    },
    package: WalletLink,
    connector: async (_, options) => {
      const { appName, networkUrl, chainId } = options
      const walletLink = new WalletLink({
        appName
      })
      const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
      await provider.enable()
      return provider
    },
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: { infuraId: process.env.REACT_APP_INFURA_KEY }
  },
};
