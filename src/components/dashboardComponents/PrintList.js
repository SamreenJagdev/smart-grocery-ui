import { Typography } from '@mui/material'
import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import moment from 'moment'

const PrintList = React.forwardRef((props, ref) => {
  const { list } = props
  return (
    <div ref={ref} sx={{ padding: '20px', margin: '20px' }}>
      <Typography align='center' variant='h3'>
        {list.name}
      </Typography>
      <Typography align='center' variant='h5'>
        {moment(list.creation_timestamp).format('MMMM Do YYYY, h:mm:ss a')}
      </Typography>

      <List sx={{ ml: '20px' }}>
        <Typography align='left' variant='h6'>
          Items
        </Typography>
        {list.items.map((item, index) => {
          const value = item.name + ' (' + item.category + ') x ' + item.quantity
          const labelId = `checkbox-list-label-${index}`
          return (
            <ListItem key={index} disablePadding>
              <ListItemIcon>
                <Checkbox edge='start' tabIndex={-1} disableRipple inputProps={{ 'aria-labelledby': labelId }} />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          )
        })}
      </List>
    </div>
  )
})

PrintList.displayName = 'PrintList'

export default PrintList
