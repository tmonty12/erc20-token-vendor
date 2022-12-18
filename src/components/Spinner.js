import { Typography, CircularProgress } from '@mui/material'

function Spinner(){
    return (
        <>
        <div style={{ height: '75px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress sx={{ color: '#30C730'}} />
        </div>
        <Typography variant="p" >Waiting for confirmation...</Typography>
        </>
    )
}

export default Spinner