import * as React from 'react'
import NavBar from '../components/commonComponents/NavBar'
import LeftBar from '../components/dashboardComponents/LeftBar'
import GroceryListTabNew from '../components/dashboardComponents/GroceryListTabNew'
import GroceryListTabLists from '../components/dashboardComponents/GroceryListTabLists'
import ReceiptsTabScan from '../components/dashboardComponents/ReceiptsTabScan'
import ReceiptTabHistory from '../components/dashboardComponents/ReceiptTabHistory'
import Footer from '../components/commonComponents/Footer'
import Box from '@mui/material/Box'
import '../style/App.css'
import { AuthContext } from '../services/useAuthHelper'
import { Navigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

const Dashboard = () => {
  const { authLoading, authenticated } = React.useContext(AuthContext)
  const [selectedTab, setSelectedTab] = React.useState('/groceryListTabNew')

  if (authLoading) {
    console.log('Loading ...')
    return <CircularProgress size={100} />
  } else if (!authenticated) {
    console.log('Not authenticated')
    return <Navigate to='/' replace />
  } else {
    const onTabChange = (newSelectedTab) => {
      return setSelectedTab(newSelectedTab)
    }

    return (
      <>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <NavBar isLoggedIn='true' />

          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <LeftBar onTabChange={onTabChange} selectedTab={selectedTab} />

            <Box component='main' sx={{ flexGrow: 2, p: 1, bgcolor: 'primary.lighter' }}>
              {/* TODO: add other tab/ screen components */}
              {selectedTab === '/groceryListTabNew' && <GroceryListTabNew />}
              {selectedTab === '/groceryListTabLists' && <GroceryListTabLists />}
              {selectedTab === '/receiptsTabScan' && <ReceiptsTabScan />}
              {selectedTab === '/receiptTabHistory' && <ReceiptTabHistory />}
            </Box>
          </Box>

          <Footer />
        </Box>
      </>
    )
  }
}

export default Dashboard
