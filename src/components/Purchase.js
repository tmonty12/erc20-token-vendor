import { Typography, FormControl, InputLabel, Input, Snackbar, Alert, Button } from '@mui/material'
import { useState } from 'react'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import { ethers } from 'ethers'
import Vendor from '../artifacts/contracts/Vendor.sol/Vendor.json'
import Spinner from './Spinner.js'

function Purchase({ vendorBalance, tokensPerEth, chainId, vendorAddress, balanceRead, vendorBalanceRead }) {
    const [purchaseIsError, setPurchaseIsError] = useState(false)
    const [purchaseAmountIsError, setPurchaseAmountIsError] = useState(false)
    const [purchaseMessage, setPurchaseMessage] = useState('')
    const [purchaseMessageOpen, setPurchaseMessageOpen] = useState(false)
    const [purchaseTokens, setPurchaseTokens] = useState(0)
    const [transactionState, setTransactionState] = useState('default')

    const purchaseConfig = usePrepareContractWrite({
        address: vendorAddress,
        abi: Vendor.abi,
        functionName: 'buyTokens',
        overrides: { value: ethers.utils.parseEther((purchaseTokens / tokensPerEth).toString()), gasLimit: 41000 },
        chainId: chainId
    })
    const purchaseWrite = useContractWrite(purchaseConfig.config)

    const onPurchase = (e) => {
        e.preventDefault()

        let purchaseError = false
        let purchaseMessage = ''

        if (purchaseTokens <= 0) {
            purchaseError = true
            purchaseMessage = 'Amount needs to be greater than 0.'
        } else if (purchaseTokens > vendorBalance) {
            purchaseError = true
            purchaseMessage = 'Amount is greater than Vendor balance.'
        } 

        const defaultPurchaseError = () => {
            setTransactionState('default')
            setPurchaseIsError(true)
            setPurchaseMessage('Error occured during purchase.')
            setPurchaseMessageOpen(true)
        }
        
        if (purchaseError) {
            setPurchaseAmountIsError(true)
            setPurchaseIsError(true)
            setPurchaseMessage(purchaseMessage)
            setPurchaseMessageOpen(true)
        } else {
            setTransactionState('signing_tx')
            purchaseWrite.writeAsync()
                .then((res) => {
                    setTransactionState('loading_tx')
                    res.wait()
                        .then((tx) =>{
                            console.log(tx)

                            if (tx.status === 1) {
                                setTransactionState('default')
                                balanceRead.refetch()
                                vendorBalanceRead.refetch()
                                setPurchaseAmountIsError(false)
                                setPurchaseTokens(0)
                                setPurchaseIsError(false)
                                setPurchaseMessage('Successful purchase!')
                                setPurchaseMessageOpen(true)
                            } else {
                                defaultPurchaseError()
                            }
                            
                        })
                        .catch((err) => console.error(err))
                })
                .catch((err) => {
                    console.error(err)
                    defaultPurchaseError()
                })
        }
    }

    const renderForm = () => {
        if (transactionState === 'loading_tx') {
            return <Spinner />
        } else {
            return (
                <>
                    <FormControl sx={{ marginTop: '20px' }}>
                        <InputLabel>Token Amount</InputLabel>
                        <Input error={purchaseAmountIsError} type='number' value={purchaseTokens} onChange={(e) => setPurchaseTokens(e.target.value)} disabled={transactionState === 'signing_tx'}/>
                    </FormControl>
                    <FormControl sx={{ marginTop: '20px' }} disabled={true}>
                        <InputLabel>Ether Value</InputLabel>
                        <Input error={false} type='number' value={purchaseTokens / tokensPerEth}/>
                    </FormControl>
                </>
                
            )
        }
    }

    const handlePurchaseMessageClose = (e, reason) => {
        setPurchaseMessageOpen(false)
    }

    return (
        <>
            <Typography variant="p" sx={{ fontWeight: 'bold', color: '#1976d2' }}>Purchase Tokens from Vendor</Typography>
            <Typography sx={{ marginTop: '10px' }}>1 ETH = {tokensPerEth} MTY</Typography>
            <form onSubmit={onPurchase}>
                {renderForm()}
                {/* <p>Waiting for transaction confirmation...</p> */}
                <br />
                <Snackbar open={purchaseMessageOpen} autoHideDuration={5000} onClose={handlePurchaseMessageClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
                    <Alert onClose={handlePurchaseMessageClose} severity={purchaseIsError ? 'error' : 'success'} sx={{ width: '100%' }}>
                        {purchaseMessage}
                    </Alert>
                </Snackbar>
                <br />
                <Button type='submit' color='primary' disabled={transactionState !== 'default'}>Purchase</Button>
            </form>
        </>
    )
}

export default Purchase