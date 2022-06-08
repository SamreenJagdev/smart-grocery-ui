import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import moment from 'moment'
import DateAdapter from '@mui/lab/AdapterMoment'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'

import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import api from '../../services/api.service'

import CircularProgress from '@mui/material/CircularProgress'

function CopyDialog(props) {
  const { onClose, open, handleCopyItems, ...other } = props
  const [searchOptions, setSearchOptions] = React.useState({
    fromDate: new Date(moment().startOf('month')),
    toDate: new Date(moment().endOf('month')),
    categoryObject: {}
  })

  const [loading, setLoading] = React.useState(false)
  const [userList, setUserList] = React.useState([{}])
  const [filteredUserList, setFilteredUserList] = React.useState([{}])

  const [checked, setChecked] = React.useState([])
  const [left, setLeft] = React.useState([])
  const [right, setRight] = React.useState([])

  React.useEffect(() => {
    async function fetchData() {
      try {
        let response = await api.get('/lists')
        if (response.status == 200) {
          setUserList(response.data.lists)
          setLoading(false)
        } else {
          console.log('List fetch call failed')
          setLoading(false)
        }
      } catch (error) {
        console.log('List fetch call failed, error: ', error)
        setLoading(false)
      }
    }

    if (open) {
      resetValues()
      setLoading(true)
      fetchData()
    }
  }, [open])

  React.useEffect(() => {
    const filteredList = [...userList].filter((o) => moment(o.creation_timestamp).isBetween(searchOptions.fromDate, searchOptions.toDate))
    setFilteredUserList(filteredList)
  }, [userList, searchOptions.fromDate, searchOptions.toDate])

  const handleCancel = () => {
    resetValues()
    onClose()
  }

  const handleCopy = () => {
    const newItems = right.map((str) => ({ category: str.split(': ')[0].trim(), name: str.split(': ')[1].trim(), quantity: 1 }))
    handleCopyItems(newItems)

    resetValues()
    onClose()
  }

  const resetValues = () => {
    setLeft([])
    setRight([])
    setSearchOptions({
      fromDate: new Date(moment().startOf('month')),
      toDate: new Date(moment().endOf('month')),
      categoryObject: {}
    })
  }

  const handleFromDateChange = (newDate) => {
    setSearchOptions({ ...searchOptions, fromDate: newDate ? newDate.toDate() : undefined })
  }

  const handleToDateChange = (newDate) => {
    setSearchOptions({ ...searchOptions, toDate: newDate ? newDate.toDate() : undefined })
  }

  const handleCategoryChange = (event, value) => {
    setSearchOptions({ ...searchOptions, categoryObject: value })
  }

  const handleSearch = () => {
    setLeft(searchOptions.categoryObject.items.map((i) => i.category + ': ' + i.name).sort())
  }

  const not = (a, b) => {
    return a.filter((value) => b.indexOf(value) === -1)
  }

  const intersection = (a, b) => {
    return a.filter((value) => b.indexOf(value) !== -1)
  }

  const union = (a, b) => {
    return [...a, ...not(b, a)]
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = (items) => intersection(checked, items).length

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
  }

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 250,
          height: 230,
          bgcolor: 'background.paper',
          overflow: 'auto'
        }}
        dense
        component='div'
        role='list'
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`

          return (
            <ListItem key={value} role='listitem' button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox checked={checked.indexOf(value) !== -1} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  //------------------------------------------------------------

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', minHeight: '60%' } }} maxWidth='md' open={open} {...other}>
      <DialogTitle>Copy items from an existing grocery list:</DialogTitle>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <DialogContent dividers>
          <Box
            sx={{
              mx: 3,
              my: 1,
              display: 'flex',
              alignItems: 'top',
              justifyContent: 'center',
              '& > :not(style)': { m: 1 }
            }}
          >
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DesktopDatePicker
                label='From Date'
                inputFormat='MM/DD/yyyy'
                value={searchOptions.fromDate}
                onChange={handleFromDateChange}
                renderInput={(params) => <TextField {...params} sx={{ width: '20%' }} />}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={DateAdapter}>
              <DesktopDatePicker
                label='To Date'
                inputFormat='MM/DD/yyyy'
                value={searchOptions.toDate}
                onChange={handleToDateChange}
                renderInput={(params) => <TextField {...params} sx={{ width: '20%' }} />}
              />
            </LocalizationProvider>

            <Autocomplete
              disablePortal
              id='categories'
              options={filteredUserList}
              getOptionLabel={(filteredUserList) => filteredUserList.name}
              sx={{ width: '20%' }}
              onChange={(event, value) => handleCategoryChange(event, value)}
              renderInput={(params) => <TextField {...params} label='Category' />}
            />

            <IconButton aria-label='delete' size='large' onClick={() => handleSearch()} key={'deleteBtn-' + props.keyIndex}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* transfer list */}
          <Grid container spacing={2} justifyContent='center' alignItems='center'>
            <Grid item>
              {customList(
                searchOptions.categoryObject && searchOptions.categoryObject.name
                  ? searchOptions.categoryObject.name + ' items: '
                  : 'Items: ',
                left
              )}
            </Grid>
            <Grid item>
              <Grid container direction='column' alignItems='center'>
                <Button sx={{ my: 0.5 }} variant='outlined' size='small' onClick={handleCheckedRight} disabled={leftChecked.length === 0}>
                  &gt;
                </Button>
                <Button sx={{ my: 0.5 }} variant='outlined' size='small' onClick={handleCheckedLeft} disabled={rightChecked.length === 0}>
                  &lt;
                </Button>
              </Grid>
            </Grid>
            <Grid item>{customList('New list items: ', right)}</Grid>
          </Grid>
        </DialogContent>
      )}
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleCopy}>Copy</Button>
      </DialogActions>
    </Dialog>
  )
}

CopyDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export function CopyListDialog(props) {
  const handleClose = () => {
    props.setOpen(false)
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <CopyDialog id='copyMenu' keepMounted open={props.open} onClose={handleClose} handleCopyItems={props.handleCopyItems} />
    </Box>
  )
}

export default CopyListDialog
