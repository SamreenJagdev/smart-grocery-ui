import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import ItemFields from './ItemFields'
import CircularProgress from '@mui/material/CircularProgress'
import api from '../../services/api.service'

function EditDialog(props) {
  const { onClose, onSave, open, currentlist, collection, ...other } = props
  const [loading, setLoading] = React.useState(false)
  const [items, setItems] = React.useState(currentlist.items)
  const [listName, setListName] = React.useState(currentlist.name)

  const addFormField = () => {
    const newItem = {
      category: '',
      name: '',
      quantity: 1
    }
    const newItems = [...items, newItem]
    setItems(newItems)
  }

  const removeItem = (index) => {
    let removedArr = [...items]
    removedArr.splice(index, 1)
    setItems(removedArr)
  }

  const updateItem = (type, index, newValue) => {
    let udpatedArr = [...items]

    if (type === 'CATEGORY') {
      udpatedArr[index].category = newValue
    } else if (type === 'SUBCATEGORY') {
      udpatedArr[index].name = newValue
    } else if (type === 'QUANTITY') {
      udpatedArr[index].quantity = newValue
    } else {
      console.log('ERROR! Wrong type: ', type)
    }

    setItems(udpatedArr)
  }

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', minHeight: '60%' } }} maxWidth='md' open={open} {...other}>
      <DialogTitle>Edit grocery list:</DialogTitle>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <DialogContent dividers>
          {/* Fields and buttons section */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              p: 5,
              gap: 2,
              borderRadius: 1
            }}
          >
            <TextField size='normal' label='List Name' value={listName} onChange={() => setListName(event.target.value)} />

            <Button
              variant='contained'
              size='medium'
              startIcon={<AddIcon />}
              sx={{
                minWidth: 150,
                backgroundColor: 'primary.light',
                borderRadius: 20
              }}
              onClick={() => addFormField()}
            >
              Add Item
            </Button>
          </Box>

          {/* Container with text fields */}

          <Box
            alignItems='center'
            sx={{
              margin: 'auto',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex'
            }}
          >
            <Paper
              sx={{
                m: 2,
                width: '95%'
              }}
            >
              {true && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'top',
                    justifyContent: 'left',
                    minHeight: '50vh'
                  }}
                >
                  <Typography variant='h4' sx={{ m: 3 }} color='text.secondary' display='block' marked='center'>
                    Items list:
                  </Typography>
                  <ItemFields items={items} removeItem={removeItem} updateItem={updateItem} />
                </Box>
              )}
            </Paper>
          </Box>
        </DialogContent>
      )}
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            onSave(currentlist, listName, items, setLoading, onClose, collection)
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

EditDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export function EditListDialog(props) {
  const handleClose = () => {
    props.setOpen(false)
  }

  const handleSave = async (list, newListName, items, loadingCallback, openDialogCallback, collection) => {
    loadingCallback(true)
    await api.put('/lists/' + list.id, {
      name: newListName,
      items: items
    })
    let itemIndex = collection.findIndex((x) => x.id === list.id)
    collection[itemIndex].name = newListName
    collection[itemIndex].items = items
    loadingCallback(false)
    openDialogCallback()
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <EditDialog
        id='editMenu'
        keepMounted
        open={props.open}
        onClose={handleClose}
        currentlist={props.currentlist}
        onSave={handleSave}
        collection={props.collection}
      />
    </Box>
  )
}

export default EditListDialog
