import { Card, CardContent, Typography, Button} from '@mui/material'
import { usePrepareContractWrite, useContractWrite } from 'wagmi'
import Vendor from '../artifacts/contracts/Vendor.sol/Vendor.json'

function BalanceCard({ userBalance, vendorBalance, address, vendorOwnerAddress, chainId, vendorAddress }) {
    const withdrawConfig = usePrepareContractWrite({
        address: vendorAddress,
        abi: Vendor.abi,
        functionName: 'withdraw',
        chainId
    })
    const withdrawWrite = useContractWrite(withdrawConfig.config)

    const withdraw = () => {
        withdrawWrite.writeAsync()
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const renderWithdrawButton = () => {
        if (address === vendorOwnerAddress) {
            return (
                <>
                    <br />
                    <Button onClick={withdraw}>Withdraw</Button>
                </>
            )
        } else {
            return <></>
        }
    }

    return (
        <Card sx={{ width: '400px', margin: 'auto', marginTop: '50px'}}>
            <CardContent sx={{ textAlign: 'center'}}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', 
                    color: '#1976d2' }}>Vendor Balance</Typography>
                <Typography sx={{ marginTop: '10px' }}>{vendorBalance} MTY</Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', 
                    color: '#1976d2', marginTop: '10px' }}>Your Balance</Typography>
                <Typography sx={{ marginTop: '10px' }}>{userBalance} MTY</Typography>
                {renderWithdrawButton()}
            </CardContent>
        </Card>
    )
}

export default BalanceCard