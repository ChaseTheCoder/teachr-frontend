import React, { useState } from 'react';
import { Box, Typography, Snackbar } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

const CopyEmail: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText('chasesheaff@teacher-lounge.com')
      .then(() => {
        setOpen(true);
      })
      .catch((err) => {
        console.error('Failed to copy email: ', err);
      });
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      <Typography
        variant="body1"
        color="primary"
        onClick={handleClick}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        fontSize={12}
      >
        <EmailIcon sx={{ marginRight: 1 }} fontSize='small' />
        chasesheaff@teacher-lounge.com
      </Typography>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message="Email Copied"
      />
    </Box>
  );
};

export default CopyEmail;