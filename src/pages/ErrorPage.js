import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
/* eslint-enable no-unused-vars */
import NotFoundImage from '../images/notFound.png'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import '../style/App.css'

const ErrorPage = () => {
  return (
    <>
      <Container
        sx={{
          mt: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box component='img' src={NotFoundImage} sx={{ height: 150, m: 5 }} />
        <Typography color='primary.light' align='center' variant='h2' marked='center' sx={{ m: 5 }}>
          Page not found!
        </Typography>

        <Typography color='primary.light' align='center' variant='h5' marked='center' sx={{ mb: 5 }}>
          Uh oh, we can&apos;t seem to find the page you are looking for. Try going back to the previous page.
        </Typography>

        <Button
          color='secondary'
          variant='contained'
          size='large'
          component={Link}
          to='/'
          align='center'
          sx={{ minWidth: 200, '&.MuiButton-text': { color: '#b7deb8' } }}
          marked='center'
        >
          Go Back Home
        </Button>
      </Container>
    </>
  )
}

export default ErrorPage
