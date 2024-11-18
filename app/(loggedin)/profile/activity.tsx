import React from 'react';
import Surface from '../../../components/surface/Surface';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { Box, Typography } from '@mui/material';
import { AlignVerticalCenter } from '@mui/icons-material';

const Activity: React.FC = () => {
  return (
    <Surface>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '3rem' }} gap={2} >
        <HistoryEduIcon fontSize='large' />
        <Typography>No Posts or Comments Yet</Typography>
      </Box>
    </Surface>
  );
};

export default Activity;