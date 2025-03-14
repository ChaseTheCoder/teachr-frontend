import { Box, Container, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface Props {
  description: string
}

export default function LoadingIndicator({ description }: Props) {

  return (
    <React.Fragment>
      <Container maxWidth="sm">
        <Box sx={{ bgcolor: '#fff', height: '100%', width: '100%', display: 'flex' }}>
          <CircularProgress size='large'/>
          <Typography align='center'>{description}</Typography>
        </Box>
      </Container>
    </React.Fragment>
  )
}