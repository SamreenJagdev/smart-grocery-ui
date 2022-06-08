import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import TablePagination from '@mui/material/TablePagination'
import ActionMenu from './ActionMenu'
import api from '../../services/api.service'

function ReceiptRow(props) {
  const { row, receipts, setReceiptsCallback } = props
  const [open, setOpen] = React.useState(false)

  async function deleteReceipt(receipt, receipts, deleteCallback) {
    let response = await api.delete('/receipts/' + receipt.id)
    if (response.status == 200) {
      let itemIndex = receipts.findIndex((x) => x.id === receipt.id)
      receipts.splice(itemIndex, 1)
      deleteCallback([...receipts])
      console.log('Receipt delete call success')
    } else {
      console.log('Receipt delete call failed')
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left'>{row.name}</TableCell>
        <TableCell align='left'>{row.merchant_name}</TableCell>
        <TableCell align='left'>{row.items.length}</TableCell>
        <TableCell align='left'>{row.creation_timestamp}</TableCell>
        <TableCell align='left'>$ {row.items.reduce((partialSum, x) => partialSum + x.total_price, 0).toFixed(2)}</TableCell>
        <TableCell align='center'>
          <ActionMenu
            item={row}
            collection={receipts}
            deleteFunction={deleteReceipt}
            deleteCallback={setReceiptsCallback}
            enabledOptions={['Delete']}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total Price</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items &&
                    row.items.map((item, index) => (
                      <TableRow key={item.name + item.quantity + index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.total_price}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function ReceiptTable(props) {
  const { rows, setReceiptsCallback } = props
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label='collapsible table'>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align='left'>Receipt Name</TableCell>
            <TableCell align='left'>Store Name</TableCell>
            <TableCell align='left'># of items</TableCell>
            <TableCell align='left'>Date</TableCell>
            <TableCell align='left'>Total</TableCell>
            <TableCell align='center'>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((receipt, index) => (
            <ReceiptRow
              key={receipt.name + receipt.creation_timestamp + index}
              row={receipt}
              receipts={rows}
              setReceiptsCallback={setReceiptsCallback}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  )
}
