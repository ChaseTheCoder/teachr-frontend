import { Box, Avatar, Skeleton, Typography } from "@mui/material";
import Surface from "../../../components/surface/Surface";

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
  user: any;
}

export default function ProfileInformation({ isLoadingUser, isLoadingProfile, profileData, user }: IProps) {
  return (
    <Surface>
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Avatar
        alt="Profile Image"
        sx={{ width: 150, height: 150 }}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', paddingX: '3rem', width: '100%' }} gap={1}>
        {isLoadingUser || isLoadingProfile ? (
        <>
          <Skeleton variant='text' sx={{ height: '50px' }} />
          <Skeleton variant='text' sx={{ height: '50px' }} />
          <Skeleton variant='text' sx={{ height: '50px' }} />
        </>
        ) : !user ? (
        <Typography variant='h1' fontWeight='bold' fontSize={44}>Error loading profile</Typography>
        ) : !profileData ? (
        <Typography variant='h1' fontWeight='bold' fontSize={44}>Welcome, create your profile</Typography>
        ) : (
        <>
          <Typography variant='h1' fontWeight='bold' fontSize={44}>{profileData.teacher_name}</Typography>
          <Typography fontSize={18}>{profileData.first_name} {profileData.last_name}</Typography>
          <Typography fontSize={18}>{profileData.title}</Typography>
        </>
        )}
      </Box>
      </Box>
    </Surface>
  );
}