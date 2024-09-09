'use client'

import { DeleteOutline } from "@mui/icons-material"
import { Box, Button, Modal, Typography } from "@mui/material"
import { useState } from "react";

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
};

export default function MaterialModal({
  title,
  link,
  id
}: {
  title: string
  link: string
  id: number
}) {
  const urlMaterial = 'https://teachr-backend.onrender.com/material/'
  const [openModal, setOpenModel] = useState(false);
  const handleClose = () => setOpenModel(false);

  const deleteMaterial = (id: number) => {
    fetch(`${urlMaterial}${id}/`, {      
      method: 'DELETE'
    })
    .then((response) => {
      response.json();
      handleClose()
    })
    .catch(error => console.log(error))
  }

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Delete {title}?
        </Typography>
        <Button color='error' startIcon={<DeleteOutline />} onClick={() => deleteMaterial(id)}>
          Delete
        </Button>
        <Typography variant="h6" component="h2">
          Go back to screen.
        </Typography>
        <Button startIcon={<DeleteOutline />} onClick={() => handleClose()}>
          Cancle
        </Button>
      </Box>
    </Modal>
  )

}