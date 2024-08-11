import { DeleteOutline } from '@mui/icons-material';
import { Box, Button, Modal, TextField } from '@mui/material';
import React from 'react';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  radius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

type Props = {
  openModal: boolean;
  handleClose: any;
  label1: string;
  value1: string;
  setValue1: any;
  label2: string | null;
  value2: string | null
  setValue2: any | null;
  crudCall: any;
  buttonTitle: string | null;
}

export default function UniversalModal({
  openModal,
  handleClose,
  label1,
  value1,
  setValue1,
  label2,
  value2,
  setValue2,
  crudCall,
  buttonTitle
  }: Props
) {



  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TextField
          label={label1}
          size='small'
          fullWidth
          multiline
          value={value1}
          onChange={e => setValue1(e.target.value)}
        />
        {label2 && (
          <TextField
            label={label2}
            size='small'
            fullWidth
            multiline
            value={value2}
            onChange={e => setValue2(e.target.value)}
          />
        )}
        <Button
          variant='contained'
          onClick={crudCall}
        >
          {buttonTitle}
        </Button>
        <Button
          color='error'
          startIcon={<DeleteOutline />} 
          onClick={() => {
            handleClose()
          }}
        >
          Cancle
        </Button>
      </Box>
    </Modal>
  )
}