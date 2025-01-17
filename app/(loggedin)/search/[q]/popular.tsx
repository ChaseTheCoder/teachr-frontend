import React from 'react';
import { Box, Typography } from '@mui/material';
import Surface from '../../../../components/surface/Surface';

const Popular: React.FC = () => {
  return (
    <Surface>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography fontSize={18}>Popular</Typography>
        <Typography fontSize={14}>#teaching</Typography>
        <Typography fontSize={14}>#professionaldevelopment</Typography>
        <Typography fontSize={14}>#doe</Typography>
      </Box>
    </Surface>
  );
};

export default Popular;