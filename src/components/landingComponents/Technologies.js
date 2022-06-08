import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import ReactLogo from '../../images/reactLogo.png'
import MaterialUILogo from '../../images/materialUILogo.png'
import FigmaLogo from '../../images/figmaLogo.png'
import FlaskLogo from '../../images/flaskLogo2.png'
import AzureFormRecognizerLogo from '../../images/azureFormRecognizerLogo2.png'
import AzureVirtualMachineLogo from '../../images/azureVirtualMachineLogo2.png'
import GoDaddyLogo from '../../images/GoDaddy.png'
import NginxLogo from '../../images/Nginx.png'
import KeycloakLogo from '../../images/keycloak.png'
import MongoDBLogo from '../../images/mongoDbLogo.jpg'
import PythonLogo from '../../images/pythonLogo.png'

const item = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  px: 5
}

const technologies = [
  { name: 'React', image: ReactLogo },
  { name: 'Material UI', image: MaterialUILogo },
  { name: 'Figma', image: FigmaLogo },
  { name: 'Python', image: PythonLogo },
  { name: 'Flask', image: FlaskLogo },
  { name: 'Mongo DB', image: MongoDBLogo },
  { name: 'Azure Virtual Machine', image: AzureVirtualMachineLogo },
  { name: 'Azure Form Recognizer', image: AzureFormRecognizerLogo },
  { name: 'GoDaddy', image: GoDaddyLogo },
  { name: 'Nginx', image: NginxLogo },
  { name: 'Keycloak', image: KeycloakLogo }
]

const Technologies = () => {
  return (
    <Box component='section' sx={{ display: 'flex', overflow: 'hidden' }}>
      <Container
        sx={{
          mt: 15,
          mb: 15,
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography variant='h4' marked='center' align='center' sx={{ mb: 10 }}>
          Technologies
        </Typography>
        <Grid alignItems='center' justifyContent='center' container spacing={1} columns={10}>
          {technologies.map((tech, index) => {
            return (
              <Grid item xs={5} md={2} key={tech.name + '-' + index}>
                <Box sx={item}>
                  <Box component='img' src={tech.image} alt='suitcase' sx={{ height: 100 }} />
                  <Typography variant='h6' marked='center' align='center' sx={{ my: 3 }}>
                    {tech.name}
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

export default Technologies
