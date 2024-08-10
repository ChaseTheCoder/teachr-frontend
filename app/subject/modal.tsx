import { DeleteOutline } from '@mui/icons-material';
import { Box, Button, TextField, Typography } from '@mui/material';
import React from 'react';
import style from 'styled-jsx/style';

export default function UniversalModal() {

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {modelContent === 'DELETE' &&
          <>
            <Typography>
              Delete forever?
            </Typography>
            <Button
              variant='contained'
              color='error'
              startIcon={<DeleteOutline />}
              onClick={() => deleteMaterial(materialId)}
            >
              Delete
            </Button>
          </>
        }
        {(modelContent === 'CREATE' || modelContent === 'UPDATE') &&
          <TextField
          label='Title'
          size='small'
          fullWidth
          multiline
            value={materialTitle}
            onChange={e => setMaterialTitle(e.target.value)}
          />
        }
        {(modelContent === 'CREATE' || modelContent === 'UPDATE') &&
          <TextField
            label='Link'
            size='small'
            fullWidth
            multiline
            value={materialLink}
            onChange={e => setMaterialLink(e.target.value)}
          />
        }
        {modelContent === 'CREATE' &&
          <Button
            variant='contained'
            disabled={disableMaterail}
            onClick={postMaterail}
          >
            Add New Material
          </Button>
        }
        {modelContent === 'UPDATE' &&
          <Button
            variant='contained'
            disabled={disableMaterail}
            onClick={() => patchMaterail(materialId)}
          >
            Update
          </Button>
        }
        <Button
          startIcon={<DeleteOutline />} 
          onClick={() => {
            setMaterialTitle('')
            setMaterialLink('')
            handleClose()
          }}
          >
          Cancle
        </Button>
      </Box>
    </Modal>
  )
}