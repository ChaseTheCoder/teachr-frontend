import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { Box, Stack } from '@mui/material';
import SideNav from '../components/sideNav/SideNav';

export default function Custom404() {
  return (
    <Stack direction='row' sx={{ width: '100%' }}>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <SideNav/>
      </Box>
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
        <h1>404 - Page Not Found</h1>
      </Box>
    </Stack>
  )
}