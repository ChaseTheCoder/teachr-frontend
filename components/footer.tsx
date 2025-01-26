import React from 'react';
import Surface from './surface/Surface';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <footer>
      <Surface>
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="row">
          <Typography variant='subtitle2' component='p' color='success'>
            <a href="/about">© 2025 Teachr Lounge</a>
          </Typography>
        </Box>
      </Surface>
    </footer>
  );
};

export default Footer;