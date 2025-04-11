import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <footer>
      <Box
        sx={{
          bgcolor: '#fff',
          padding: .5,
          borderRadius: 4,
          position: 'relative',
          marginTop: 3
        }}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row">
          <Typography variant='subtitle2' component='p' color='success'>
            <a href="/about">© 2025 Teacher Lounge</a>
          </Typography>
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;