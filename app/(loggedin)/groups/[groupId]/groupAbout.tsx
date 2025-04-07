import { Box, Typography } from "@mui/material";

interface GroupAboutProps {
  about: string;
}

const GroupAbout: React.FC<GroupAboutProps> = ({about}) => {
  return (
    <Box
      sx={{
        paddingX: 2,
        paddingY: 1.5,
        borderRadius: 4,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
      gap={.5}
    >
      <Typography
        fontSize={{xs: 12, md: 14}}
        fontWeight='bold'
      >
        About this group
      </Typography>
      <Typography
        fontSize={{xs: 12, md: 14}}
      >
        {about}
      </Typography>
    </Box>
  );
}

export default GroupAbout;