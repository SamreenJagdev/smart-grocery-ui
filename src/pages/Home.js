import * as React from 'react'
import NavBar from '../components/commonComponents/NavBar'
import TitleSection from '../components/landingComponents/TitleSection'
import Features from '../components/landingComponents/Features'
import Technologies from '../components/landingComponents/Technologies'
import Team from '../components/landingComponents/Team'
import Footer from '../components/commonComponents/Footer'
import '../style/App.css'

const Home = () => {
  return (
    <React.Fragment>
      <NavBar isLoggedIn='false' />
      <TitleSection />
      <Features />
      <Technologies />
      <Team />
      <Footer />
    </React.Fragment>
  )
}

export default Home
