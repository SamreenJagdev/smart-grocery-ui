import * as React from 'react'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import DateAdapter from '@mui/lab/AdapterMoment'
import moment from 'moment'
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import ItemFields from './ItemFields'
import api from '../../services/api.service'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import CopyListDialog from './CopyListDialog'

const GroceryListTabNew = () => {
  //Use default current date
  const [groceryListObject, setGroceryListObject] = React.useState({ date: new Date(moment().toDate()), name: '', items: [] })
  const [items, setItems] = React.useState([])
  const [showEmptyMessage, setShowEmptyMessage] = React.useState(true)
  const [loading, setLoading] = React.useState({ saving: false, predicting: false })
  const [openAlert, setOpenAlert] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState({ message: '', severity: '' })
  const [validationMessage, setValidationMessage] = React.useState({ listName: '', listDate: '' })
  const [openDialog, setOpenDialog] = React.useState(false)

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

  const addCopyItems = (itemsList) => {
    const newItemsList = [...items]
    newItemsList.push(...itemsList)
    setItems(newItemsList)
  }

  const handleGroceryListDateChange = (newDate) => {
    setGroceryListObject({ ...groceryListObject, date: newDate ? newDate.toDate() : undefined })
    if (groceryListObject.date == undefined) {
      setValidationMessage({ ...validationMessage, listDate: groceryListObject.date === '' ? 'Required field' : '' })
    }
  }

  const handleGroceryListNameChange = (event) => {
    setGroceryListObject({ ...groceryListObject, name: event.target.value })

    if (groceryListObject.name !== '') {
      setValidationMessage({ ...validationMessage, listName: groceryListObject.name === '' ? 'Required field' : '' })
    }
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setAlertMessage({ message: '', severity: '' })
  }

  const handleClickCopy = () => {
    setOpenDialog(true)
  }

  const handleClickCancel = () => {
    setGroceryListObject({ date: new Date(moment().toDate()), name: '', items: [] })
    setItems([])
  }

  const handleClickSave = () => {
    if (groceryListObject.name === '' || groceryListObject.date == undefined) {
      setValidationMessage({
        ...validationMessage,
        listName: groceryListObject.name === '' ? 'Required field' : '',
        listDate: groceryListObject.date == undefined ? 'Required field' : ''
      })
    } else {
      setValidationMessage({
        ...validationMessage,
        listName: groceryListObject.name === '' ? 'Required field' : '',
        listDate: groceryListObject.date == undefined ? 'Required field' : ''
      })
      setLoading({ ...loading, saving: true })
      fetchData()
    }
  }

  const handleClickPrediction = () => {
    setLoading({ ...loading, predicting: true })
    fetchPredictionData()
  }

  async function fetchData() {
    try {
      let response = await api.post('/lists', {
        name: groceryListObject.name,
        creation_timestamp: moment(groceryListObject.date).format('yyyy-MM-DD HH:mm:ss.SSS'),
        items: groceryListObject.items
      })
      if (response.status == 201) {
        setLoading({ ...loading, saving: false })

        setAlertMessage({
          message: 'New grocery list "' + groceryListObject.name + '" was succesfully created! View or print on list tab',
          severity: 'success'
        })
        setOpenAlert(true)

        setGroceryListObject({ date: new Date(moment().toDate()), name: '', items: [] })
        setItems([])
      } else {
        setLoading({ ...loading, saving: false })

        setAlertMessage({ message: 'Error! Grocery list was not saved.', severity: 'error' })
        setOpenAlert(true)
      }
    } catch (error) {
      setLoading({ ...loading, saving: false })

      setAlertMessage({ message: 'Error! Grocery list was not saved.', severity: 'error' })
      setOpenAlert(true)
    }
  }

  async function fetchPredictionData() {
    try {
      let response = await api.post('/lists/predict', {
        date: moment(groceryListObject.date).format('yyyy-MM-DD HH:mm:ss.SSS')
      })
      if (response.status == 200) {
        setLoading({ ...loading, predicting: false })

        setAlertMessage({
          message: 'New items generated through AI prediction based on your previous purchases were added to your grocery list!',
          severity: 'info'
        })
        setOpenAlert(true)

        const newPredictedListItems = response.data.items.map((element) => ({
          category: element.category,
          name: element.name,
          quantity: 1
        }))

        addCopyItems(newPredictedListItems)
      } else {
        setLoading({ ...loading, predicting: false })

        setAlertMessage({ message: 'Error! There was an error dudring the prediction of your new grocery list items', severity: 'error' })
        setOpenAlert(true)
      }
    } catch (error) {
      setLoading({ ...loading, predicting: false })

      setAlertMessage({ message: 'Error! There was an error dudring the prediction of your new grocery list items', severity: 'error' })
      setOpenAlert(true)
    }
  }

  React.useEffect(() => {
    setShowEmptyMessage(items.length < 1)
    setGroceryListObject({ ...groceryListObject, items: items })
  }, [items])

  return (
    <Paper
      sx={{
        m: 2,
        maxWidth: '200vh',
        minHeight: '75vh',
        backgroundColor: 'rawTheme.palette.common.white'
      }}
    >
      {/* Header Section */}
      <Typography align='left' variant='h4' sx={{ p: 5 }}>
        Create New List
      </Typography>
      <Divider variant='middle' />
      {/* <List /> */}

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
        <TextField
          size='normal'
          label='List Name'
          required
          value={groceryListObject.name}
          onChange={handleGroceryListNameChange}
          error={validationMessage.listName !== ''}
          helperText={validationMessage.listName !== '' ? validationMessage.listName : ''}
        />

        <LocalizationProvider dateAdapter={DateAdapter}>
          <DesktopDatePicker
            label='List Date'
            inputFormat='MM/DD/yyyy'
            value={groceryListObject.date}
            onChange={handleGroceryListDateChange}
            required
            renderInput={(params) => (
              <TextField
                required
                {...params}
                error={validationMessage.listDate !== ''}
                helperText={validationMessage.listDate !== '' ? validationMessage.listDate : ''}
              />
            )}
          />
        </LocalizationProvider>

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
          disabled={loading.saving || loading.predicting}
        >
          Add Item
        </Button>
        <Button
          variant='contained'
          size='medium'
          startIcon={<ContentCopyIcon />}
          sx={{
            minWidth: 150,
            backgroundColor: 'primary.light',
            borderRadius: 20
          }}
          onClick={() => handleClickCopy()}
          disabled={loading.saving || loading.predicting}
        >
          Copy
        </Button>

        <Box
          sx={{
            display: 'flex',
            position: 'relative'
          }}
        >
          <Button
            variant='contained'
            size='medium'
            startIcon={<AutoFixHighIcon />}
            sx={{
              minWidth: 150,
              backgroundColor: 'primary.light',
              borderRadius: 20
            }}
            onClick={() => handleClickPrediction()}
            disabled={loading.saving || loading.predicting}
          >
            Predict List
          </Button>
          {loading.predicting && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px'
              }}
            />
          )}
        </Box>
      </Box>

      {/* Container with text fields */}

      <Box
        alignItems='center'
        sx={{
          maring: 'auto',
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
          {openAlert && (
            <Alert
              variant='filled'
              severity={alertMessage.severity}
              sx={{ mb: 2 }}
              action={
                <IconButton aria-label='close' color='inherit' size='small' onClick={() => handleCloseAlert()}>
                  <CloseIcon fontSize='inherit' />
                </IconButton>
              }
            >
              {alertMessage.message}
            </Alert>
          )}

          {showEmptyMessage ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '50vh'
              }}
            >
              <>
                <ErrorOutlineIcon sx={{ fontSize: 150, color: '#9e9e9e' }} />
                <Typography sx={{ mt: 5 }} color='#9e9e9e' display='block' fontSize={24} variant='caption' marked='center'>
                  Items list is empty!
                </Typography>

                <Typography sx={{ mt: 5 }} color='#9e9e9e' display='block' fontSize={16} variant='caption' marked='center'>
                  Add items, copy from a previous grocery list or let the application autogenerate a list for you.
                </Typography>
              </>
            </Box>
          ) : null}

          {!showEmptyMessage ? (
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
              {items && <ItemFields items={items} removeItem={removeItem} updateItem={updateItem} />}
            </Box>
          ) : null}
        </Paper>
      </Box>

      {/* Footer buttons */}
      <Box
        sx={{
          m: 2,
          pb: 3,
          display: 'flex',
          justifyContent: 'right',
          '& > :not(style)': { m: 1 }
        }}
      >
        <Button
          variant='outlined'
          size='large'
          color='secondary'
          sx={{ minWidth: 150 }}
          disabled={loading.saving || loading.predicting}
          onClick={() => handleClickCancel()}
        >
          Cancel
        </Button>

        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            sx={{ minWidth: 150 }}
            disabled={loading.saving || loading.predicting}
            onClick={() => handleClickSave()}
          >
            Create
          </Button>
          {loading.saving && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px'
              }}
            />
          )}
        </Box>
      </Box>
      {openDialog && <CopyListDialog open={openDialog} setOpen={setOpenDialog} handleCopyItems={addCopyItems} />}
    </Paper>
  )
}

export default GroceryListTabNew
