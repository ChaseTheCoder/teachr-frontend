import { Box, Avatar, Skeleton, Typography } from "@mui/material";
import Surface from "../../../../components/surface/Surface";

interface IProfileData {
  teacher_name: string;
  first_name: string;
  last_name: string;
  title: string;
}

interface IProps {
  isLoadingUser: boolean;
  isLoadingProfile: boolean;
  profileData: IProfileData | undefined;
  error: boolean;
}

export default function ProfileInformation({ isLoadingUser, isLoadingProfile, profileData, error }: IProps) {
  return (
    <Surface>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
          alt="Profile Image"
          sx={{ width: {xs: 100, md:150}, height: {xs: 100, md:150} }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', paddingLeft: { xs: '1rem', sm: '3rem' }, width: '100%' }} gap={1}>
        {isLoadingUser || isLoadingProfile ? (
          <>
            <Skeleton variant='text' sx={{ height: '50px' }} />
            <Skeleton variant='text' sx={{ height: '50px' }} />
            <Skeleton variant='text' sx={{ height: '50px' }} />
          </>
          ) : error ? (
            <Typography
              variant='h1'
              fontWeight='bold'
              sx={{ fontSize: { xs: 22, sm: 32, md: 44 } }}
            >
              Error loading profile
            </Typography>
            ) : !profileData ? (
              <Typography
                variant='h1'
                fontWeight='bold'
                sx={{ fontSize: { xs: 22, sm: 32, md: 44 } }}
              >
                Welcome, create your profile
              </Typography>
              ) : (
              <>
                <Typography
                  variant='h1'
                  fontWeight='bold'
                  sx={{ fontSize: { xs: 32, sm: 44 } }}
                >
                  {profileData.teacher_name}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: 16, sm: 18 } }}
                >
                  {profileData.first_name} {profileData.last_name}
                </Typography>
                <Typography
                  sx={{ fontSize: { xs: 16, sm: 18 } }}
                  color='textSecondary'
                >
                  {profileData.title}
                </Typography>
          </>
        )}
      </Box>
      </Box>
    </Surface>
  );
}