import { Typography, FormControl, InputLabel, Input, Snackbar, Alert, Button } from '@mui/material'
import { useState } from 'react'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import MontyToken from '../artifacts/contracts/MontyToken.sol/MontyToken.json'
import Vendor from '../artifacts/contracts/Vendor.sol/Vendor.json'
import Spinner from './Spinner.js'

function Sell({ userBalance, tokensPerEth, allowance, chainId, vendorAddress, tokenAddress, balanceRead, vendorBalanceRead }) {
    const [sellTokens, setSellTokens] = useState(0)
    const [sellAmountIsError, setSellAmountIsError] = useState(false)
    const [sellIsError, setSellIsError] = useState(false)
    const [sellMessage, setSellMessage] = useState('')
    const [sellMessageOpen, setSellMessageOpen] = useState(false)
    
    const [transactionState, setTransactionState] = useState('default')

    const approveConfig = usePrepareContractWrite({
        address: tokenAddress,
        abi: MontyToken.abi,
        functionName: 'approve',
        args: [vendorAddress, (sellTokens * (10**18)).toString()],
        overrides: { gasLimit: 47000 },
        chainId: chainId
    })

    const sellConfig = usePrepareContractWrite({
        address: vendorAddress,
        abi: Vendor.abi,
        functionName: 'sellTokens',
        args: [(allowance * (10**18)).toString()],
        overrides: { gasLimit: 59000 },
        chainId: chainId
    })

    const approveWrite = useContractWrite(approveConfig.config)
    const sellWrite = useContractWrite(sellConfig.config)

    const onSell = (e) => {
        e.preventDefault()

        const defaultSellError = () => {
            setTransactionState('default')
            setSellIsError(true)
            setSellMessage('Error occured during transfer.')
            setSellMessageOpen(true)
        }

        if (allowance <= 0) {
            let sellError = false
            let sellMessage = ''

            if (sellTokens > userBalance) {
                sellError = true
                sellMessage = 'Amount is greater than your balance'
            } 

            if (sellTokens <= 0){
                sellError = true
                sellMessage = 'Amount needs to be greater than 0'
            }
            
            if (sellError) {
                setSellIsError(true)
                setSellMessage(sellMessage)
                setSellAmountIsError(true)
                setSellMessageOpen(true)
            } else {
                setTransactionState('signing_tx')
                approveWrite.writeAsync()
                    .then((res) => {
                        setTransactionState('loading_tx')
                        res.wait()
                            .then((tx) =>{
                                console.log(tx)

                                if (tx.status === 1) {
                                    setTransactionState('default')
                                    setSellAmountIsError(false)
                                    setSellIsError(false)
                                    setSellMessage('Successfully approved of token transfer.')
                                    setSellMessageOpen(true)
                                } else {
                                    defaultSellError()
                                }
                                
                            })
                            .catch((err) => console.error(err))
                    })
                    .catch((err) => {
                        console.error(err)
                        defaultSellError()
                    })
            }
            
        } else {
            setTransactionState('signing_tx')
            sellWrite.writeAsync()
                .then((res) => {
                    setTransactionState('loading_tx')
                    res.wait()
                        .then((tx) =>{
                            console.log(tx)

                            if (tx.status === 1) {
                                setTransactionState('default')
                                balanceRead.refetch()
                                vendorBalanceRead.refetch()
                                setSellTokens(0)
                                setSellIsError(false)
                                setSellMessage('Successully sold tokens to Vendor!')
                                setSellMessageOpen(true)
                            } else {
                                defaultSellError()
                            }
                            
                        })
                        .catch((err) => {
                            console.error(err)
                        })
                })
                .catch((err) => {
                    console.error(err)
                    defaultSellError()
                })
        }
    }

    const onChange = (e) => {
        if (allowance <= 0) {
            setSellTokens(e.target.value)
        }
    }

    const renderForm = () => {
        if (transactionState === 'loading_tx') {
            return <Spinner />
        } else {
            return (
                <>
                <FormControl sx={{ marginTop: '20px' }} disabled={allowance > 0 || transactionState === 'signing_tx'}>
                    <InputLabel>Token Amount</InputLabel>
                    <Input error={sellAmountIsError} type='number' value={allowance > 0 ? allowance : sellTokens} onChange={onChange}/>
                </FormControl>
                <FormControl sx={{ marginTop: '20px' }} disabled={true}>
                    <InputLabel>Ether Value</InputLabel>
                    <Input type='number' value={sellTokens / tokensPerEth}/>
                </FormControl>
            </>
            )
        }   
    }

    const handleSellMessageClose = (e, reason) => {
        setSellMessageOpen(false)
    }

    return (
        <>
            <Typography variant="p" sx={{ fontWeight: 'bold', 
            color: '#1976d2' }}>Sell Tokens to Vendor</Typography>
            <Typography sx={{ marginTop: '10px' }}>1 ETH = {tokensPerEth} MTY</Typography>
            <form onSubmit={onSell}>
                {renderForm()}
                <br />
                <Snackbar open={sellMessageOpen} autoHideDuration={5000} onClose={handleSellMessageClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert onClose={handleSellMessageClose} severity={sellIsError ? 'error' : 'success'} sx={{ width: '100%' }}>
                        {sellMessage}
                    </Alert>
                </Snackbar>
                <br />
                <Button type='submit' color='primary' disabled={transactionState !== 'default'}>{allowance > 0 ? 'Sell' : 'Approve'}</Button>
            </form>
        </>
    )
}

export default Sell