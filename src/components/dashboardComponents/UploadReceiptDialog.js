import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import CircularProgress from '@mui/material/CircularProgress'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import ImageUploading from 'react-images-uploading'
import ClearIcon from '@mui/icons-material/Clear'
import api from '../../services/api.service'
import Alert from '@mui/material/Alert'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

function UploadDialog(props) {
  const { onClose, open, handleReceiptScan, ...other } = props
  const [loading, setLoading] = React.useState(false)
  const [alertMessage, setAlertMessage] = React.useState({ message: '', severity: '' })
  const [openAlert, setOpenAlert] = React.useState(false)

  const [images, setImages] = React.useState([])
  const maxNumber = 1

  const handleCloseAlert = () => {
    setOpenAlert(false)
    setAlertMessage({ message: '', severity: '' })
  }

  const handleClickUploadFile = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex)
    setImages(imageList)
  }

  const handleCancel = () => {
    onClose()
  }

  const handleScan = () => {
    if (images.length > 0) {
      setLoading(true)
      postData()
    }
  }

  async function postData() {
    try {
      var formData = new FormData()
      formData.append('file', images[0].file)

      let response = await api.post('/receipts/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response.status == 200) {
        setLoading(false)
        handleReceiptScan(response.data)
        onClose()
      } else {
        setLoading(false)
        setAlertMessage({ message: 'Error! There was an error scaning the receipt', severity: 'error' })
        setOpenAlert(true)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      setAlertMessage({ message: 'Error! There was an error scaning the receipt', severity: 'error' })
      setOpenAlert(true)
    }
  }

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%', minHeight: '60%' } }} maxWidth='sm' open={open} {...other}>
      <DialogTitle>Upload an image to scan your receipt:</DialogTitle>

      <ImageUploading multiple value={images} onChange={handleClickUploadFile} maxNumber={maxNumber} dataURLKey='data_url'>
        {({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
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
              {/* Add upload image button */}

              <Button
                variant='contained'
                size='medium'
                startIcon={<AddPhotoAlternateIcon />}
                sx={{
                  minWidth: 150,
                  backgroundColor: 'primary.light',
                  borderRadius: 20
                }}
                disabled={images.length > 0}
                //isDragging
                color={isDragging ? 'secondary' : 'primary'}
                onClick={onImageUpload}
                {...dragProps}
              >
                Upload / Drop
              </Button>

              <Button
                variant='contained'
                size='medium'
                startIcon={<ClearIcon />}
                sx={{
                  minWidth: 150,
                  backgroundColor: 'primary.light',
                  borderRadius: 20
                }}
                disabled={images.length < 1}
                color={isDragging ? 'secondary' : 'primary'}
                onClick={onImageRemoveAll}
                {...dragProps}
              >
                Remove
              </Button>
            </Box>
            {/* Image view */}
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
            <Box
              sx={{
                display: 'flex',
                alignItems: 'top',
                justifyContent: 'center',
                '& > :not(style)': { m: 1 }
              }}
            >
              {imageList.map((image, index) => (
                <div key={index} className='image-item'>
                  <img src={image.data_url} alt='' width='250' />
                </div>
              ))}
            </Box>
          </DialogContent>
        )}
      </ImageUploading>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Box sx={{ m: 1, position: 'relative' }}>
          <Button onClick={handleScan} disabled={images.length < 1}>
            Scan
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
      </DialogActions>
    </Dialog>
  )
}

UploadDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export function UploadReceiptDialog(props) {
  const handleClose = () => {
    props.setOpen(false)
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <UploadDialog id='copyMenu' keepMounted open={props.open} onClose={handleClose} handleReceiptScan={props.handleReceiptScan} />
    </Box>
  )
}

export default UploadReceiptDialog
