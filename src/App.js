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
  const walletConnectConnector = new WalletConnectConnector({ chains: [hardhatLocal, goerli] })
  // const connector = new InjectedConnector({
  //   chains: [hardhatLocal]
  // })

  const { provider } = configureChains(
    [hardhatLocal, goerli],
    [ alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_API_KEY }),
      // walletConnectProvider({ projectId: '1498e7776a0001dcef16c3ec7c3fd54f' }),
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
      // modalConnectors({ appName: 'web3Modal', chains: [goerli]}),

    ]
  })

  // const ethereumClient = new EthereumClient(client, [goerli])

  return (
    
    <>
      <WagmiConfig client={client} >
        <Stake metamaskConnector={metamaskConnector} walletConnectConnector={walletConnectConnector} hardhatChain={hardhatLocal} provider={provider} />
      </WagmiConfig>

      {/* <Web3Modal projectId='1498e7776a0001dcef16c3ec7c3fd54f' ethereumClient={ethereumClient}/> */}
    </>
    
  );
}

export default App;
