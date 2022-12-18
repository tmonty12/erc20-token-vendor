import { Typography, FormControl, InputLabel, Input, Snackbar, Alert, Button } from '@mui/material'
import { ethers } from 'ethers'
import { useState } from 'react'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import MontyToken from '../artifacts/contracts/MontyToken.sol/MontyToken.json'
import Spinner from './Spinner.js'

function Transfer({ userBalance, balanceRead, vendorBalanceRead, chainId, tokenAddress }) {
    const [transferValue, setTransferValue] = useState(0)
    const [transferValueError, setTransferValueError] = useState(false)
    const [transferAddress, setTransferAddress] = useState('')
    const [transferAddressError, setTransferAddressError] = useState(false)
    const [transferMessageOpen, setTransferMessageOpen] = useState(false)
    const [transferIsError, setTransferIsError] = useState(false)
    const [transferMessage,  setTransferMessage] = useState('')
    const [transactionState, setTransactionState] = useState('default')

    const transferConfig = usePrepareContractWrite({
        address: tokenAddress,
        abi: MontyToken.abi,
        functionName: 'transfer',
        args: [transferAddress, (transferValue * (10**18)).toString()],
        overrides: { gasLimit: 53000 },
        chainId: chainId
    })
    const transferWrite = useContractWrite(transferConfig.config)

    const onTransfer = (e) => {
        e.preventDefault()

        let transferError = false
        let transferMessage = ''

        if (!ethers.utils.isAddress(transferAddress)){
            transferError = true
            transferMessage = 'Invalid address'
            setTransferAddressError(true)
        } else {
            setTransferAddressError(false)
        }

        let transferValueError = false
        if (transferValue > userBalance) {
            transferError = true
            transferMessage = 'Amount greater than balance'
            transferValueError = true
        } 
        
        if (transferValue <= 0) {
            transferError = true
            transferMessage = 'Amount needs to be greater than 0'
            transferValueError = true
        }

        if (transferValueError) {
            setTransferValueError(true)
        } else {
            setTransferValueError(false)
        }

        const defaultTransferError = () => {
            setTransactionState('default')
            setTransferIsError(true)
            setTransferMessage('Error occured during transfer.')
            setTransferMessageOpen(true)
        }
        

        if (transferError) {
            setTransferIsError(true)

            setTransferMessage(transferMessage)
            setTransferMessageOpen(true)
        } else {
            setTransactionState('signing_tx')
            transferWrite.writeAsync()
                .then((res) => {
                    setTransactionState('loading_tx')
                    res.wait()
                        .then((tx) => {
                            console.log(tx)

                            if (tx.status === 1) {
                                setTransactionState('default')
                                balanceRead.refetch()
                                vendorBalanceRead.refetch()
                                setTransferIsError(false)
                                
                                setTransferAddress('')
                                setTransferValue(0)
                                setTransferAddressError(false)
                                setTransferValueError(false)
                                setTransferMessage('Successful transfer!')
                                setTransferMessageOpen(true)
                            } else {
                                defaultTransferError()
                            }
                            
                        })
                        .catch((err) => console.error(err))

                    
                })
                .catch((err) => {
                    console.error(err)
                    defaultTransferError()
                })
        }   
    }

    const renderForm = () => {
        if (transactionState === 'loading_tx') {
            return <Spinner />
        } else{
            return (
                <>
                    <FormControl sx={{ marginTop: '20px' }}>
                        <InputLabel>Amount</InputLabel>
                        <Input error={transferValueError} type='number' value={transferValue} onChange={(e) => setTransferValue(e.target.value)} disabled={transactionState === 'signing_tx'}/>
                    </FormControl>
                    <FormControl sx={{ marginTop: '20px' }}>
                        <InputLabel>Address</InputLabel>
                        <Input error={transferAddressError} value={transferAddress} onChange={(e) => setTransferAddress(e.target.value)} disabled={transactionState === 'signing_tx'}/>
                    </FormControl>
                </>
            )
        }
    }

    const handleTransferMessageClose = (e, reason) => {
        setTransferMessageOpen(false)
    }

    return (
        <>
        <Typography variant="p" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Transfer Tokens to Address</Typography>
            <form onSubmit={onTransfer}>
                {renderForm()}
                <br />
                <Snackbar open={transferMessageOpen} autoHideDuration={5000} onClose={handleTransferMessageClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert onClose={handleTransferMessageClose} severity={transferIsError ? 'error' : 'success'} sx={{ width: '100%' }}>
                        {transferMessage}
                    </Alert>
                </Snackbar>
                <br />
                <Button type='submit' color='primary' disabled={transactionState !== 'default'}>Transfer</Button>
            </form>
        </>
    )
}

export default Transfer