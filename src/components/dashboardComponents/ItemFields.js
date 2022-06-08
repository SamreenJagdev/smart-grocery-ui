import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import IconButton from '@mui/material/IconButton'
import CategoriesService from '../../services/itemsCategories.service'

const ItemFields = (props) => {
  const getSubCategories = (index) => {
    return CategoriesService.getSubCategory(props.items[index].category ? props.items[index].category : '')
  }

  const handleCaterogyChange = (index, event, value) => {
    props.updateItem('CATEGORY', index, value)
  }

  const handleSubCaterogyChange = (index, event, value) => {
    props.updateItem('SUBCATEGORY', index, value ? value : event.target.value)
  }

  const handleQuantityChange = (index, event) => {
    props.updateItem('QUANTITY', index, event.target.value)
  }

  return props.items.map((item, index) => (
    <Box
      sx={{
        mx: 3,
        my: 1,
        display: 'flex',
        alignItems: 'top',
        justifyContent: 'left',
        '& > :not(style)': { m: 1 }
      }}
      key={'fieldsBox-' + index}
    >
      <Autocomplete
        disablePortal
        id='categories'
        value={item.category === '' ? null : item.category}
        options={CategoriesService.getAllCategories()}
        sx={{ width: 300 }}
        onChange={(event, value) => handleCaterogyChange(index, event, value)}
        renderInput={(params) => <TextField {...params} label='Category' />}
      />

      <Autocomplete
        id='subCategories'
        freeSolo
        value={item.name}
        options={getSubCategories(index)}
        sx={{ width: 300 }}
        onChange={(event, value) => handleSubCaterogyChange(index, event, value)}
        renderInput={(params) => (
          <TextField {...params} label='Item' onChange={(event, value) => handleSubCaterogyChange(index, event, value)} />
        )}
      />

      <TextField
        size='normal'
        label='Quantity'
        type='number'
        value={item.quantity}
        InputProps={{
          inputProps: {
            max: 100,
            min: 1
          }
        }}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => handleQuantityChange(index, event)}
      />

      <IconButton aria-label='delete' size='large' onClick={() => props.removeItem(index)} key={'deleteBtn-' + props.keyIndex}>
        <HighlightOffIcon />
      </IconButton>
    </Box>
  ))
}

export default ItemFields
