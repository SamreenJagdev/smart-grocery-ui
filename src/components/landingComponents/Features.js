import Typography from '@mui/material/Typography'
import ImageCurvyLines from '../../images/productCurvyLines.png'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5
}

const features = [
  {
    name: 'Account Managment',
    description: 'User registration and login. You will be able to setup and personalize your account to get better prediction results',
    icon: <ManageAccountsIcon color='disabled' sx={{ fontSize: 80 }} />
  },
  {
    name: 'Grocery List',
    description:
      'By registering, you will be able to create grocery list by adding items manually, ' +
      'copy from previous lists or the system can predict and auto generate a list for you.',
    icon: <LocalGroceryStoreIcon color='disabled' sx={{ fontSize: 80 }} />
  },
  {
    name: 'Scan Receipt',
    description:
      'By registering, you will be able to scan receipt pictures and get details ' + ' like items, quantity, price, total, store name ...',
    icon: <DocumentScannerIcon color='disabled' sx={{ fontSize: 80 }} />
  },
  {
    name: 'Receipt & Grocery List History',
    description: 'By registering, you will be having acess to all the history of  grocery lists and receipts.',
    icon: <ReceiptLongIcon color='disabled' sx={{ fontSize: 80 }} />
  }
]

const Features = () => {
  return (
    <Box component='section' sx={{ display: 'flex', overflow: 'hidden', bgcolor: 'secondary.light' }}>
      <Container
        sx={{
          mt: 15,
          mb: 30,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box component='img' src={ImageCurvyLines} alt='curvy lines' sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }} />
        <Typography variant='h4' marked='center' align='center' sx={{ mb: 10 }}>
          Features
        </Typography>
        <Grid container spacing={2}>
          {features.map((feature, index) => {
            return (
              <Grid item xs={12} md={6} key={feature.name + '-' + index}>
                <Box sx={item}>
                  <Box sx={{ height: 55 }}>{feature.icon}</Box>
                  <Typography variant='h6' sx={{ my: 5 }}>
                    {feature.name}
                  </Typography>
                  <Typography align='center' variant='h5'>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

export default Features
