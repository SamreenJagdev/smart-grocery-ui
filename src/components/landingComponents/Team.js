import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import AldaPicture from '../../images/Alda.jpg'
import BirinderPicture from '../../images/Birinder.jpg'
import ChrisPicture from '../../images/Chris.png'

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5
}

const teamMembers = [
  {
    name: 'Alda Garcia Rodriguez',
    avatar: <Avatar src={AldaPicture} sx={{ width: 100, height: 100 }} />
  },
  {
    name: 'Birinder Jagdev ',
    avatar: <Avatar src={BirinderPicture} sx={{ width: 100, height: 100 }} />
  },
  {
    name: 'Chris Desantis',
    avatar: <Avatar src={ChrisPicture} sx={{ width: 100, height: 100 }} />
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
        <Typography variant='h4' marked='center' align='center' sx={{ mb: 2 }}>
          Team
        </Typography>
        <Typography variant='h6' marked='center' align='center' sx={{ mb: 10 }} color='primary.light'>
          (Group #7)
        </Typography>
        <Grid container spacing={2}>
          {teamMembers.map((member, index) => {
            return (
              <Grid item xs={12} md={4} key={member.name + '-' + index}>
                <Box sx={item}>
                  {member.avatar}
                  <Typography variant='h6' sx={{ my: 5 }}>
                    {member.name}
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
