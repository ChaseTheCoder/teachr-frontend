import { Box, Typography } from "@mui/material";

interface GroupAboutProps {
  about: string;
  rules: string;
}

const GroupAbout: React.FC<GroupAboutProps> = ({about, rules}) => {
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
        variant='h2'
        sx={{
          fontSize: { xs: 12, sm: 14 },
          width: '100%',
          marginBottom: .5
        }}
        fontWeight='bold'
      >
        About this group
      </Typography>
      <Typography
        fontSize={{xs: 12, md: 14}}
        color='textSecondary'
      >
        {about}
      </Typography>
      {rules && (
        <>
          <Typography
            variant='h2'
            sx={{
              fontSize: { xs: 12, sm: 14 },
              width: '100%',
              marginTop: 2,
              marginBottom: .5
            }}
            fontWeight='bold'
          >
            Group Rules
          </Typography>
          <Box
            sx={{ 
            fontSize: { xs: 12, sm: 14 },
            color: '#424242',
            margin: 0,
            width: '100%',
            lineHeight: 1.4,
            '& a': {
              color: 'blue',
              textDecoration: 'underline',
            },
            '& *': {
              margin: 0,
            }
            }}
            dangerouslySetInnerHTML={{ __html: rules }}
          />
        </>
      )}
    </Box>
  );
}

export default GroupAbout;