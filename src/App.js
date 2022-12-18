import { createClient, WagmiConfig, configureChains } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import Stake from './components/Stake.js'

function App() {
  const hardhatLocal = {
    id: 1337,
    name: 'Hardhat',
    network: 'hardhat',
    rpcUrls: {
      default: 'http://127.0.0.1:8545'
    }
  }

  // const provider = new providers.JsonRpcProvider('http://127.0.0.1:8545/', 1337)
  const metamaskConnector = new MetaMaskConnector({ chains: [hardhatLocal, goerli] })
  const walletConnectConnector = new WalletConnectConnector({ 
    chains: [hardhatLocal, goerli], 
    options: {
      qrcode: true,
    }
  })
  // const connector = new InjectedConnector({
  //   chains: [hardhatLocal]
  // })

  const { provider } = configureChains(
    [hardhatLocal, goerli],
    [ alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }),
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id !== hardhatLocal.id) return null
          return { http: hardhatLocal.rpcUrls.default }
        },
      })
    ]
  )

  const client = createClient({
    provider,
    connectors : [
      metamaskConnector,
      walletConnectConnector
    ]
  })

  return (
    
    <>
      <WagmiConfig client={client} >
        <Stake metamaskConnector={metamaskConnector} walletConnectConnector={walletConnectConnector} hardhatChain={hardhatLocal} provider={provider} />
      </WagmiConfig>
    </>
    
  );
}

export default App;
