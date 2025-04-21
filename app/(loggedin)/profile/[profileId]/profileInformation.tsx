import { Box, Avatar, Skeleton, Typography } from "@mui/material";
import Surface from "../../../../components/surface/Surface";
import { IProfile } from "../../../../types/types";

interface IProfileData {
  teacher_name: string;
  first_name: string;
  last_name: string;
  title: string;
  profile_pic_url: string;
}

interface IProps {
  isLoadingUser: boolean;
  isLoadingProfile: boolean;
  profileData: IProfile | undefined;
  error: boolean;
}

export default function ProfileInformation(
  { isLoadingUser, isLoadingProfile, profileData, error }: IProps) {
  const size = 64;
  const imageUrl = profileData.profile_pic_url ? 
  `${profileData.profile_pic_url}?t=${new Date().getTime()}` : 
  undefined;
  
  return (
    <Surface>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box display='inline-flex'>
        <Box position="relative" display="inline-block" sx={{ overflow: 'visible' }}>
          {profileData.verified &&
            <>
              <div 
                className="absolute"
                style={{ 
                  width: size * 0.2,
                  height: size * 0.1875,
                  transform: 'translateX(-30%) translateY(-10%) rotate(10deg)',
                  borderRadius: '100% 0 100% 0',
                  backgroundColor: '#4caf50',
                  top: '-7%',
                  left: '47%',
                  zIndex: 20,
                  position: 'absolute',
                  overflow: 'visible',
                }}
              />
              <div 
                className="absolute"
                style={{ 
                  width: size * 0.05,
                  height: size * 0.15,
                  transform: 'translateX(0%) translateY(-40%) rotate(-10deg)',
                  borderRadius: '10% 10% 0 0',
                  backgroundColor: '#8B4513',
                  top: '-5%',
                  left: '41%',
                  zIndex: 10,
                  position: 'absolute',
                  overflow: 'visible',
                }}
              />
            </>
          }
          <Avatar
            alt="Profile Image"
            sx={{ width: { xs: 75, md: 100 }, height: { xs: 75, md: 100 }, marginRight: '.5rem' }}
            src={profileData.profile_pic_url}
          />
        </Box>
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