import Typography from '@mui/material/Typography'
import TitleSectionLayout from './TitleSectionLayout'
/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
/* eslint-enable no-unused-vars */
import Image1 from '../../images/background1.jpg'

const TitleSection = () => {
  return (
    <TitleSectionLayout
      sxbackground={{
        backgroundImage: `url(${Image1})`,
        backgroundColor: '#74d4ac', // Average color of the background image.
        backgroundPosition: 'center'
      }}
    >
      <img style={{ display: 'none' }} src={Image1} alt='increase priority' />
      <Typography color='inherit' align='center' variant='h2' marked='center'>
        Plan your grocery shopping
      </Typography>
      <Typography color='inherit' align='center' variant='h5' sx={{ mb: 4, mt: { sx: 4, sm: 10 } }}>
        “Shop well, waste less and spend less”
      </Typography>
    </TitleSectionLayout>
  )
}

export default TitleSection
