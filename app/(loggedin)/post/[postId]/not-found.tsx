import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { Box, Stack } from '@mui/material';

export default function Post404() {
  return (
    <Stack direction='row' sx={{ width: '100%' }}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="85vh"
        flexDirection="column"
        width="100%"
        gap={3}
      >
        <SentimentNeutralIcon
          width="100px"
          height="100px"
        />
        <h1>Post Not Found</h1>
        <h2>Either the post was deleted or there was an error. Please try again later.</h2>
      </Box>
    </Stack>
  )
}