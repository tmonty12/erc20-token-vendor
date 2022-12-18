import { useState, useEffect } from 'react'
import { Tab, Tabs, Container, Box, Card, CardContent, AppBar, Toolbar } from '@mui/material'
import { useConnect, useAccount, useNetwork, useDisconnect, useContractRead, useContractEvent } from 'wagmi'
import { goerli } from 'wagmi/chains'
import MessageCard from './MessageCard.js'
import BalanceCard from './BalanceCard.js'
import TabPanel from './TabPanel.js'
import Transfer from './Transfer.js'
import Purchase from './Purchase.js'
import Sell from './Sell.js'
import Menu from './Menu.js'
import MontyToken from '../artifacts/contracts/MontyToken.sol/MontyToken.json'
import Vendor from '../artifacts/contracts/Vendor.sol/Vendor.json'
import '../App.css'

const TOKEN_ADDRESS = (process.env.REACT_APP_NETWORK === 'localhost') ? process.env.REACT_APP_LOCALHOST_TOKEN_ADDRESS : process.env.REACT_APP_GOERLI_TOKEN_ADDRESS 
const VENDOR_ADDRESS = (process.env.REACT_APP_NETWORK === 'localhost') ? process.env.REACT_APP_LOCALHOST_VENDOR_ADDRESS : process.env.REACT_APP_GOERLI_VENDOR_ADDRESS 

function Stake({ metamaskConnector, walletConnectConnector, hardhatChain }) {
    const [balance, setBalance] = useState(0)
    const [vendorBalance, setVendorBalance] = useState(0)
    const [tokensPerEth, setTokensPerEth] = useState(100)
    const [tabValue, setTabValue] = useState(0)
    const [allowance, setAllowance] = useState(0)

    const { connect } = useConnect({ metamaskConnector, walletConnectConnector })
    const { disconnect } = useDisconnect()
    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()

    const CHAIN_ID = (process.env.REACT_APP_NETWORK === 'localhost') ? hardhatChain.id : goerli.id

    const balanceRead = useContractRead({
        address: TOKEN_ADDRESS,
        abi: MontyToken.abi,
        functionName: 'balanceOf',
        args: [address],
        chainId: CHAIN_ID
    })
    const userBalance = balanceRead.data

    const vendorBalanceRead = useContractRead({
        address: TOKEN_ADDRESS,
        abi: MontyToken.abi,
        functionName: 'balanceOf',
        args: [VENDOR_ADDRESS],
        chainId: CHAIN_ID
    })

    const vendorTokensPerEth = useContractRead({
        address: VENDOR_ADDRESS,
        abi: Vendor.abi,
        functionName: 'tokensPerEth',
        chainId: CHAIN_ID
    })

    const vendorOwner = useContractRead({
        address: VENDOR_ADDRESS,
        abi: Vendor.abi,
        functionName: 'owner',
        chainId: CHAIN_ID
    })

    const allowanceRead = useContractRead({
        address: TOKEN_ADDRESS,
        abi: MontyToken.abi,
        functionName: 'allowance',
        args: [address, VENDOR_ADDRESS],
        chainId: CHAIN_ID
    })

    useContractEvent({
        address: TOKEN_ADDRESS,
        abi: MontyToken.abi,
        eventName: 'Transfer',
        listener(node, label, owner) {
            console.log('Transfer event')
            balanceRead.refetch()
            vendorBalanceRead.refetch()
            allowanceRead.refetch()
        },
        chainId: CHAIN_ID
    })

    useContractEvent({
        address: TOKEN_ADDRESS,
        abi: MontyToken.abi,
        eventName: 'Approval',
        listener(node, label, owner) {
            console.log('Approval event')
            balanceRead.refetch()
            vendorBalanceRead.refetch()
            allowanceRead.refetch()
        },
        chainId: CHAIN_ID
    })
    
    const network = process.env.REACT_APP_NETWORK

    useEffect(() => {
        if (userBalance) {
            setBalance(parseInt(userBalance.toString()) / (10**18))
        }

        if (vendorBalanceRead.data) {
            setVendorBalance(parseInt(vendorBalanceRead.data.toString()) / (10**18))
        }

        if (vendorTokensPerEth.data) {
            setTokensPerEth(parseInt(vendorTokensPerEth.data.toString()))
        }

        if (allowanceRead.data) {
            const allowanceData = parseInt(allowanceRead.data.toString()) / (10**18)
            setAllowance(allowanceData)
        }
    }, [userBalance, vendorTokensPerEth, vendorBalanceRead, vendorBalance, allowanceRead])    

    const renderBody = () => {
        if (!isConnected) {
            return <MessageCard>Please connect your wallet</MessageCard>
        } else if (chain && ((network === 'localhost' && chain.id !== 1337) || (network === 'goerli' && chain.id !== 5))) {
            return <MessageCard>Please switch to {network} network</MessageCard>
        } else {
            return (
                <Box sx={{ marginBottom: '50px' }}>
                    <BalanceCard userBalance={balance} vendorBalance={vendorBalance} address={address} vendorOwnerAddress={vendorOwner.data} chainId={CHAIN_ID} vendorAddress={VENDOR_ADDRESS}/>
                    <Card sx={{ width: '400px', margin: 'auto', marginTop: '50px'}}>
                        <CardContent>
                            <Tabs value={tabValue} onChange={(e, num) => setTabValue(num)}>
                                <Tab label='Transfer'/>
                                <Tab label='Purchase'/>
                                <Tab label='Sell'/>
                            </Tabs>
                            <TabPanel value={tabValue} index={0}>
                                <Transfer userBalance={balance} balanceRead={balanceRead} vendorBalanceRead={vendorBalanceRead} chainId={CHAIN_ID} vendorAddress={VENDOR_ADDRESS} tokenAddress={TOKEN_ADDRESS}/>
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <Purchase vendorBalance={vendorBalance} tokensPerEth={tokensPerEth} chainId={CHAIN_ID} vendorAddress={VENDOR_ADDRESS} balanceRead={balanceRead} vendorBalanceRead={vendorBalanceRead}/>
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <Sell userBalance={balance} tokensPerEth={tokensPerEth} allowance={allowance} chainId={CHAIN_ID} tokenAddress={TOKEN_ADDRESS} vendorAddress={VENDOR_ADDRESS} balanceRead={balanceRead} vendorBalanceRead={vendorBalanceRead}/>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Box>
            )
        }
    }

    return (
        <Container maxWidth="md" >
            <Box>
                <AppBar position="static">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end'}}>
                        <Menu connect={connect} metamaskConnector={metamaskConnector} walletConnectConnector={walletConnectConnector} disconnect={disconnect} isConnected={isConnected}/>
                    </Toolbar>
                </AppBar>
            </Box>
            {renderBody()}
      </Container>
    )
}

export default Stake;