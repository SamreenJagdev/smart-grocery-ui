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
import MenuItem from '@mui/material/MenuItem'
import SearchIcon from '@mui/icons-material/Search'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import ReceiptTable from './ReceiptTable'
import api from '../../services/api.service'
import CircularProgress from '@mui/material/CircularProgress'

const ReceiptTabHistory = (props) => {
  const [fromDateValue, setFromDateValue] = React.useState(new Date(moment().startOf('month').toDate()))
  const [toDateValue, setToDateValue] = React.useState(new Date(moment().toDate()))
  const [receipt, setReceipt] = React.useState('')
  const [receipts, setReceipts] = React.useState([])
  const [isFiltered, setIsFiltered] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleFromDateChange = (newDate) => {
    setFromDateValue(newDate)
  }
  const handleToDateChange = (newDate) => {
    setToDateValue(newDate)
  }
  const handleReceiptChange = (event) => {
    setReceipt(event.target.value)
  }

  React.useEffect(fetchData, [])
  React.useEffect(() => {
    if (receipts.length > 0) {
      setReceipt('')
    }
  }, [receipts.length])

  async function fetchData() {
    setIsLoading(true)
    let response = await api.get('/receipts')
    if (response.status == 200) {
      setReceipts(response.data.receipts)
      if (response.data.receipts > 0) setReceipt(response.data.receipts[0].name)
    } else {
      console.log('Receipt fetch call failed')
    }
    setIsLoading(false)
  }

  async function searchWithCriteria() {
    if (isFiltered) {
      await fetchData()
    }
    let newReceipts = [...receipts]
    newReceipts = newReceipts.filter((object) => moment(object.creation_timestamp).isBetween(fromDateValue, toDateValue))
    if (receipt !== '') newReceipts = newReceipts.filter((object) => object.name === receipt)

    setReceipts(newReceipts)
    setIsFiltered(true)
  }

  return (
    <Paper
      sx={{
        m: 2,
        maxWidth: '200vh',
        minHeight: '75vh',
        backgroundColor: 'rawTheme.palette.common.white'
      }}
    >
      <Typography align='left' variant='h4' sx={{ p: 5 }}>
        Receipt History
      </Typography>
      <Divider variant='middle' />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 5,
          gap: 2,
          borderRadius: 1
        }}
      >
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DesktopDatePicker
            label='From Date'
            inputFormat='MM/DD/yyyy'
            value={fromDateValue}
            onChange={handleFromDateChange}
            required
            renderInput={(params) => <TextField required {...params} />}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <DesktopDatePicker
            label='To Date'
            inputFormat='MM/DD/yyyy'
            value={toDateValue}
            onChange={handleToDateChange}
            required
            renderInput={(params) => <TextField required {...params} />}
          />
        </LocalizationProvider>

        <FormControl sx={{ minWidth: 150 }} key={'categorySelect-' + props.keyIndex}>
          <InputLabel id='selectReceiptLabel'>Select Receipt</InputLabel>
          <Select
            value={receipt}
            size='normal'
            label='Select Receipt'
            id={'selectCategory'}
            onChange={handleReceiptChange}
            sx={{ minWidth: 150 }}
            labelId='selectReceiptLabel'
          >
            {receipts.map((option, index) => (
              <MenuItem value={option.name} key={option.name + '-' + index}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant='contained'
          size='medium'
          startIcon={<SearchIcon />}
          sx={{
            minWidth: 150,
            backgroundColor: 'primary.light',
            borderRadius: 20
          }}
          onClick={() => searchWithCriteria()}
        >
          Filter
        </Button>

        <Button
          variant='contained'
          size='medium'
          startIcon={<SearchIcon />}
          sx={{
            minWidth: 150,
            backgroundColor: 'primary.light',
            borderRadius: 20
          }}
          onClick={() => fetchData() && setIsFiltered(false)}
        >
          Reset
        </Button>
      </Box>

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
          <ReceiptTable rows={receipts} setReceiptsCallback={setReceipts} />
          {isFiltered && (
            <Typography align='center' sx={{ padding: '10px' }}>
              Receipts are being filtered with search criteria.
            </Typography>
          )}
          {isLoading && (
            <Typography align='center' sx={{ padding: '10px' }}>
              <CircularProgress />
            </Typography>
          )}
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
      ></Box>
    </Paper>
  )
}

export default ReceiptTabHistory
