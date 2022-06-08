import * as React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ReactToPrint from 'react-to-print'
import PrintList from './PrintList'

export default function ActionMenu(props) {
  const { item, collection, deleteFunction, deleteCallback, setOpenEditDialog, enabledOptions } = props
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [componentRef, setComponentRef] = React.useState(null)

  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickEdit = (call) => {
    call(true)
  }

  return (
    <React.Fragment>
      <Box>
        <Tooltip title='Menu'>
          <IconButton
            onClick={handleClick}
            size='small'
            sx={{ ml: 2 }}
            aria-controls={open ? 'menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id='menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {enabledOptions.includes('Edit') && <MenuItem onClick={() => handleClickEdit(setOpenEditDialog)}>Edit</MenuItem>}

        {enabledOptions.includes('Delete') && (
          <MenuItem
            onClick={() => {
              deleteFunction(item, collection, deleteCallback)
            }}
          >
            Delete
          </MenuItem>
        )}

        {enabledOptions.includes('Print') && (
          <ReactToPrint
            content={() => componentRef}
            trigger={() => {
              return <MenuItem>Print</MenuItem>
            }}
          />
        )}
      </Menu>
      <div style={{ display: 'none' }}>
        <PrintList list={item} ref={setComponentRef} />
      </div>
    </React.Fragment>
  )
}
