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
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner'
import ReceiptIcon from '@mui/icons-material/Receipt'
import UploadReceiptDialog from './UploadReceiptDialog'
import ReciptsItemFields from './ReceiptsItemFields'
import api from '../../services/api.service'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

const ReceiptsTabScan = () => {
  // Use default current date
  const [showEmptyMessage, setShowEmptyMessage] = React.useState(true)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState({ message: '', severity: '' })
  const [openAlert, setOpenAlert] = React.useState(false)
  const [validationMessage, setValidationMessage] = React.useState({ receiptName: '', receiptDate: '', storeName: '' })
  const [receiptObject, setReceiptObject] = React.useState({
    date: new Date(moment().toDate()),
    name: '',
    storeName: '',
    total: 0,
    items: []
  })

  const handleReceiptDateChange = (newDate) => {
    setReceiptObject({ ...receiptObject, date: newDate })
  }

  const handleReceiptNameChange = (event) => {
    setReceiptObject({ ...receiptObject, name: event.target.value })
  }

  const handleReceiptStoreNameChange = (event) => {
    setReceiptObject({ ...receiptObject, storeName: event.target.value })
  }

  const handleAddingScanResults = (scanResult) => {
    //add new items
    const newReceiptObject = { ...receiptObject }
    newReceiptObject.date = scanResult.creation_timestamp
    newReceiptObject.name = moment(scanResult.creation_timestamp).format('MM/DD/yyyy') + '_'
    newReceiptObject.name = scanResult.merchant_name
      ? newReceiptObject.name + scanResult.merchant_name
      : newReceiptObject.name + 'NewReceipt'
    newReceiptObject.storeName = scanResult.merchant_name
    //newReceiptObject.total = scanResult.items.map((item) => item.total_price).reduce((prev, curr) => prev + curr, 0)
    newReceiptObject.items = scanResult.items.map((element) => ({
      name: element.name,
      quantity: element.quantity == 0 ? 1 : element.quantity,
      price: element.price == 0 ? element.total_price : element.price,
      total_price: element.total_price
    }))

    setReceiptObject(newReceiptObject)
  }

  const removeItem = (index) => {
    let removedArr = [...receiptObject.items]
    removedArr.splice(index, 1)
    setReceiptObject({ ...receiptObject, items: removedArr })
  }

  const updateItem = (type, index, newValue) => {
    let udpatedArr = [...receiptObject.items]

    if (type === 'PRICE') {
      udpatedArr[index].price = newValue
    } else if (type === 'TOTALPRICE') {
      udpatedArr[index].total_price = newValue
    } else if (type === 'SUBCATEGORY') {
      udpatedArr[index].name = newValue
    } else if (type === 'QUANTITY') {
      udpatedArr[index].quantity = newValue
    } else {
      console.log('ERROR! Wrong type: ', type)
    }

    setReceiptObject({ ...receiptObject, items: udpatedArr })
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setAlertMessage({ message: '', severity: '' })
  }

  const handleCancelClick = () => {
    resetForm()
  }

  const handleClickScanReceipt = () => {
    resetForm()
    setOpenDialog(true)
  }

  const handleSaveClick = () => {
    if (
      receiptObject.name === '' ||
      receiptObject.name === null ||
      receiptObject.storeName === '' ||
      receiptObject.storeName === null ||
      receiptObject.date == undefined ||
      receiptObject.date == null
    ) {
      setValidationMessage({
        ...validationMessage,
        receiptName: receiptObject.name === '' || receiptObject.name === null ? 'Required field' : '',
        storeName: receiptObject.storeName === '' || receiptObject.storeName === null ? 'Required field' : '',
        receiptDate: receiptObject.date == undefined || receiptObject.date == null ? 'Required field' : ''
      })
    } else {
      setValidationMessage({
        ...validationMessage,
        receiptName: receiptObject.name === '' ? 'Required field' : '',
        storeName: receiptObject.storeName === '' ? 'Required field' : '',
        receiptDate: receiptObject.date == undefined ? 'Required field' : ''
      })
      setLoading(true)
      fetchData()
    }
  }

  async function fetchData() {
    try {
      let response = await api.post('/receipts', {
        name: receiptObject.name,
        creation_timestamp: moment(receiptObject.date).format('yyyy-MM-DD HH:mm:ss.SSS'),
        merchant_name: receiptObject.storeName,
        items: receiptObject.items.map((element) => ({
          name: element.name,
          quantity: element.quantity,
          price: element.price,
          total_price: element.total_price
        }))
      })
      if (response.status == 201) {
        setLoading(false)

        setAlertMessage({
          message: 'New receipt "' + receiptObject.name + '" was succesfully created! View on receipt history tab',
          severity: 'success'
        })

        setOpenAlert(true)
        resetForm()
      } else {
        setLoading(false)

        setAlertMessage({ message: 'Error! Receipt was not saved.', severity: 'error' })
        setOpenAlert(true)
      }
    } catch (error) {
      setLoading(false)

      setAlertMessage({ message: 'Error! Receipt was not saved.', severity: 'error' })
      setOpenAlert(true)
    }
  }

  const resetForm = () => {
    setReceiptObject({ date: new Date(moment().toDate()), name: '', storeName: '', total: 0, items: [] })
  }

  React.useEffect(() => {
    //Calcute receipt total
    const newTotal = receiptObject.items.map((item) => Number(item.total_price)).reduce((prev, curr) => prev + curr, 0)
    setReceiptObject({ ...receiptObject, total: newTotal })

    //Set empty message if lenght is less than 1
    setShowEmptyMessage(receiptObject.items.length < 1)
  }, [receiptObject.items])

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
        Scan a Receipt
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
          label='Receipt Name'
          value={receiptObject.name}
          required
          //disabled={showEmptyMessage}
          onChange={handleReceiptNameChange}
          error={validationMessage.receiptName !== ''}
          helperText={validationMessage.receiptName !== '' ? validationMessage.receiptName : ''}
        />
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DesktopDatePicker
            label='Receipt Date'
            inputFormat='MM/DD/yyyy'
            value={receiptObject.date}
            onChange={handleReceiptDateChange}
            required
            //disabled={showEmptyMessage}
            renderInput={(params) => (
              <TextField
                required
                {...params}
                error={validationMessage.receiptDate !== ''}
                helperText={validationMessage.receiptDate !== '' ? validationMessage.receiptDate : ''}
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          size='normal'
          label='Store Name'
          required
          value={receiptObject.storeName}
          onChange={handleReceiptStoreNameChange}
          error={validationMessage.storeName !== ''}
          helperText={validationMessage.storeName !== '' ? validationMessage.storeName : ''}
        />
        <TextField size='normal' label='Total' value={'$' + receiptObject.total.toFixed(2)} disabled={true} />
        <Button
          variant='contained'
          size='medium'
          startIcon={<ReceiptIcon />}
          disabled={loading}
          sx={{
            minWidth: 150,
            backgroundColor: 'primary.light',
            borderRadius: 20
          }}
          onClick={() => handleClickScanReceipt()}
        >
          Scan Receipt
        </Button>
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
                <DocumentScannerIcon sx={{ fontSize: 150, color: '#9e9e9e' }} />
                <Typography sx={{ mt: 5 }} color='#9e9e9e' display='block' fontSize={24} variant='caption' marked='center'>
                  Scan a Receipt
                </Typography>

                <Typography sx={{ mt: 5 }} color='#9e9e9e' display='block' fontSize={16} variant='caption' marked='center'>
                  Upload or take a picutre of a receipt to scan items and save it ont the receipt history
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
              {receiptObject && receiptObject.items && (
                <ReciptsItemFields items={receiptObject.items} removeItem={removeItem} updateItem={updateItem} />
              )}
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
        <Button variant='outlined' size='large' color='secondary' sx={{ minWidth: 150 }} onClick={handleCancelClick} disabled={loading}>
          Cancel
        </Button>

        <Box sx={{ m: 1, position: 'relative' }}>
          <Button
            variant='contained'
            size='large'
            color='secondary'
            sx={{ minWidth: 150 }}
            disabled={showEmptyMessage || loading}
            onClick={handleSaveClick}
          >
            Save
          </Button>
          {loading && (
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

      {openDialog && <UploadReceiptDialog open={openDialog} setOpen={setOpenDialog} handleReceiptScan={handleAddingScanResults} />}
    </Paper>
  )
}

export default ReceiptsTabScan
