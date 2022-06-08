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
import ListTable from './ListTable'
import api from '../../services/api.service'
import CircularProgress from '@mui/material/CircularProgress'

const GroceryListTabLists = (props) => {
  const [fromDateValue, setFromDateValue] = React.useState(new Date(moment().startOf('month').toDate()))

  const [toDateValue, setToDateValue] = React.useState(new Date(moment().toDate()))

  const [groceryList, setList] = React.useState('')

  const [isFiltered, setIsFiltered] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const handleFromDateChange = (newDate) => {
    setFromDateValue(newDate)
  }

  const handleToDateChange = (newDate) => {
    setToDateValue(newDate)
  }

  const handleListChange = (event) => {
    setList(event.target.value)
  }

  const [lists, setLists] = React.useState([])

  async function fetchData() {
    setIsLoading(true)
    let response = await api.get('/lists')
    if (response.status == 200) {
      setLists(response.data.lists)
      if (response.data.lists > 0) setList(response.data.lists[0].name)
    } else {
      console.log('List fetch call failed')
    }
    setIsLoading(false)
  }

  async function searchWithCriteria() {
    if (isFiltered) {
      await fetchData()
    }
    let newList = [...lists]
    newList = newList.filter((object) => moment(object.creation_timestamp).isBetween(fromDateValue, toDateValue))
    if (groceryList !== '') newList = newList.filter((object) => object.name === groceryList)

    setLists(newList)
    setIsFiltered(true)
  }

  React.useEffect(fetchData, [])
  React.useEffect(() => {
    if (lists.length > 0) {
      setList('')
    }
  }, [lists.length])

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
        Active Lists
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
          <InputLabel id='selectCategoryLabel'>Select List</InputLabel>
          <Select
            placeholder='Select List'
            value={groceryList}
            label='Select List'
            id='selectCategory'
            onChange={handleListChange}
            labelId='selectCategoryLabel'
          >
            {lists.map((option, index) => (
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
          margin: 'auto',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex'
        }}
      >
        <Paper sx={{ m: 2, width: '95%' }}>
          <ListTable rows={lists} setListsCallback={setLists} />
          {isFiltered && (
            <Typography align='center' sx={{ padding: '10px' }}>
              Lists are being filtered with search criteria.
            </Typography>
          )}
          {isLoading && (
            <Typography align='center' sx={{ padding: '10px' }}>
              <CircularProgress />
            </Typography>
          )}
        </Paper>
      </Box>
    </Paper>
  )
}

export default GroceryListTabLists
