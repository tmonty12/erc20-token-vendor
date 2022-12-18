import { Dialog, List, ListItemButton, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import metamaskLogo from '../metamask.png'
import walletConnectLogo from '../walletconnect.png'

function Menu({ connect, metamaskConnector, walletConnectConnector, isConnected, disconnect}) {
    const [openModal, setOpenModal] = useState(false)

    const handleClose = () => {
        setOpenModal(false)
    }

    const handleOpen = () => {
        setOpenModal(true)
    }

    useEffect(() => {
        if (isConnected) {
            setOpenModal(false)
        }
    }, [isConnected])

    let btnText
    let fn
    if (openModal) {
        btnText = 'Connecting...'
        fn = handleOpen
    } else if (isConnected) {
        btnText = 'Connected'
        fn = disconnect
    } else {
        btnText = 'Connect'
        fn = handleOpen
    }

    return (
        <>
            <Button id='connect-button' onClick={fn}>{btnText}</Button>
            <Dialog open={openModal} onClose={handleClose}>
                <List sx={{ pt: 0 }}>
                    <ListItemButton onClick={() => connect({ connector: metamaskConnector }) }>
                        <ListItemAvatar>
                            <Avatar src={metamaskLogo}/>
                        </ListItemAvatar>
                        <ListItemText primary='Metamask' secondary='Connect to your Metamask Wallet'/>
                    </ListItemButton>
                    <ListItemButton onClick={() => connect({ connector: walletConnectConnector })}>
                        <ListItemAvatar>
                            <Avatar src={walletConnectLogo}/>
                        </ListItemAvatar>
                        <ListItemText primary='WalletConnect' secondary='Scan with WalletConnect to connect'/>
                    </ListItemButton>
                </List>
            </Dialog>
        </>
    )
}

export default Menu