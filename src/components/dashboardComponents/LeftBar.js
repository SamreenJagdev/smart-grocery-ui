import * as React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'

import MuiDrawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import { styled } from '@mui/material/styles'

import ListItemIcon from '@mui/material/ListItemIcon'
import ListSubheader from '@mui/material/ListSubheader'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ListAltIcon from '@mui/icons-material/ListAlt'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import TokenService from '../../services/token.service'

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9)
      }
    })
  }
}))

const drawerWidth = 220

const menuItems = [
  {
    type: 'subtitle',
    label: 'Grocery List'
  },
  {
    type: 'option',
    label: 'New',
    icon: <AddCircleOutlineIcon />,
    navigationLink: '/groceryListTabNew'
  },
  {
    type: 'option',
    label: 'Lists',
    icon: <ListAltIcon />,
    navigationLink: '/groceryListTabLists'
  },
  {
    type: 'subtitle',
    label: 'Receipts'
  },
  {
    type: 'option',
    label: 'Scan',
    icon: <DocumentScannerIcon />,
    navigationLink: '/receiptsTabScan'
  },
  {
    type: 'option',
    label: 'History',
    icon: <ReceiptLongIcon />,
    navigationLink: '/receiptTabHistory'
  }
]

const getMenuOptionsComponent = (props) => {
  let menuOptionsComponent = []
  menuItems.map((item, index) => {
    if (item.type === 'subtitle') {
      menuOptionsComponent.push(
        <React.Fragment key={item.name + '-' + index}>
          <Divider sx={{ my: 1 }} />
          <ListSubheader component='div' inset>
            {item.label}
          </ListSubheader>
        </React.Fragment>
      )
    } else {
      menuOptionsComponent.push(
        <React.Fragment key={item.name + '-' + index}>
          <ListItemButton
            onClick={() => props.onTabChange(item.navigationLink)}
            selected={item.navigationLink === props.selectedTab}
            sx={{
              color: 'success.dark',
              borderRadius: 1,
              mx: 1,
              '& .MuiListItemIcon-root': {
                color: 'success.main'
              }
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </React.Fragment>
      )
    }
  })

  return menuOptionsComponent
}

const LeftBar = (props) => {
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant='permanent' open={open}>
        {/* LeftBar Header */}
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            mt: 1
          }}
        >
          {open ? (
            <Typography variant='h6' marked='center' align='center'>
              {/* John Smith */}
              {TokenService.getUserInfo() ? TokenService.getUserInfo().name : 'John Smith'}
            </Typography>
          ) : (
            ''
          )}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={toggleDrawer}>{open ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
          </Box>
        </Toolbar>
        <List component='nav'>{getMenuOptionsComponent(props)}</List>
      </Drawer>
    </Box>
  )
}

export default LeftBar
