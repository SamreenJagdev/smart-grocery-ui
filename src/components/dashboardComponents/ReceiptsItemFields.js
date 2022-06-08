import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import IconButton from '@mui/material/IconButton'
import CategoriesService from '../../services/itemsCategories.service'
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value
          }
        })
      }}
      thousandSeparator
      isNumericString
      prefix='$'
    />
  )
})

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

const ReceiptsItemFields = (props) => {
  const getSubCategories = (index) => {
    return CategoriesService.getSubCategory(props.items[index].category ? props.items[index].category : '')
  }

  const handleSubCaterogyChange = (index, event, value) => {
    props.updateItem('SUBCATEGORY', index, value ? value : event.target.value)
  }

  const handleQuantityChange = (index, event) => {
    props.updateItem('QUANTITY', index, event.target.value)
  }

  const handlePriceChange = (index, event) => {
    props.updateItem('PRICE', index, event.target.value)
  }

  const handleTotalPriceChange = (index, event) => {
    props.updateItem('TOTALPRICE', index, event.target.value)
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
            max: 1000,
            min: 0,
            step: 0.02
          }
        }}
        InputLabelProps={{ shrink: true }}
        onChange={(event) => handleQuantityChange(index, event)}
      />

      <TextField
        size='normal'
        label='Price'
        value={Number(item.price).toFixed(2)}
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
        onChange={(event) => handlePriceChange(index, event)}
        InputLabelProps={{ shrink: true }}
      />

      <TextField
        size='normal'
        label='Total Price'
        value={Number(item.total_price).toFixed(2)}
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
        onChange={(event) => handleTotalPriceChange(index, event)}
        InputLabelProps={{ shrink: true }}
      />

      <IconButton aria-label='delete' size='large' onClick={() => props.removeItem(index)} key={'deleteBtn-' + props.keyIndex}>
        <HighlightOffIcon />
      </IconButton>
    </Box>
  ))
}

export default ReceiptsItemFields
