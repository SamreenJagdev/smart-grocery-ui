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
import EditListDialog from './EditListDialog'

function ListRow(props) {
  const { row, lists, setListsCallback } = props
  const [open, setOpen] = React.useState(false)
  const [openEditDialog, setOpenEditDialog] = React.useState(false)

  async function deleteList(list, lists, deleteCallback) {
    let response = await api.delete('/lists/' + list.id)
    if (response.status == 200) {
      let itemIndex = lists.findIndex((x) => x.id === list.id)
      lists.splice(itemIndex, 1)
      deleteCallback([...lists])
      console.log('List delete call success')
    } else {
      console.log('List delete call failed')
    }
  }

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: '5vh' }}>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align='left'>{row.name}</TableCell>
        <TableCell align='left'>{row.items.length}</TableCell>
        <TableCell align='left'>{row.creation_timestamp}</TableCell>
        <TableCell align='center'>
          <ActionMenu
            item={row}
            collection={lists}
            deleteFunction={deleteList}
            deleteCallback={setListsCallback}
            setOpenEditDialog={setOpenEditDialog}
            enabledOptions={['Edit', 'Delete', 'Print']}
          />
          {openEditDialog && <EditListDialog open={openEditDialog} setOpen={setOpenEditDialog} currentlist={row} collection={lists} />}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.items &&
                    row.items.map((item) => (
                      <TableRow key={item.name + item.quantity}>
                        <TableCell component='th' scope='row'>
                          {item.category}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
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

export default function ListTable(props) {
  const { rows, setListsCallback } = props
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
    <>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell align='left'>List Name</TableCell>
              <TableCell align='left'>No. of items</TableCell>
              <TableCell align='left'>Date</TableCell>
              <TableCell align='center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((list) => (
              <ListRow key={list.name + list.creation_timestamp} row={list} lists={rows} setListsCallback={setListsCallback} />
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
    </>
  )
}
