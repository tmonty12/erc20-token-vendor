import { Box } from '@mui/material'

function TabPanel({ children, value, index }) {
    return (
        <div
          role="tabpanel"
          hidden={value !== index}
          style={{ textAlign: 'center'}}
        >
          {value === index && (
            <Box sx={{ p: 3 }}>
              {children}
            </Box>
          )}
        </div>
      );
}

export default TabPanel