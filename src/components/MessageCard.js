import { Box, Card, CardContent, Typography} from '@mui/material'

function MessageCard({ children }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Card sx={{ maxWidth: 400}}>
                <CardContent sx={{ textAlign: 'center'}}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', color: '#1976d2'}}>
                        {children}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    )
}

export default MessageCard