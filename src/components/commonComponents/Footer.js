import * as React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'

const Footer = () => {
  return (
    <Typography component='footer' sx={{ display: 'flex', bgcolor: 'primary.light' }}>
      <Container sx={{ my: 1, display: 'flex' }}>
        <Grid container spacing={2} sx={{ height: 130 }}>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ mt: 2 }} color='secondary.main'>
              MacMaster University
            </Typography>
            <Typography variant='h7' color='secondary.main'>
              Senior Engineering Project - ENG TECH 4FD3
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant='h7' color='secondary.main'>
              {'© '} Smart Grocery {new Date().getFullYear()}
            </Typography>{' '}
          </Grid>
        </Grid>
      </Container>
    </Typography>
  )
}

export default Footer
