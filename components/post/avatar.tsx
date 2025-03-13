import React from 'react';
import { Avatar, Box } from '@mui/material';

interface TeacherAvatarProps {
  verified: boolean;
  profile_pic_url?: string | null | undefined;
}

const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ verified, profile_pic_url }) => {
  const size = 64;
  return (
    <Box display='inline-flex'>
      <Box position="relative" display="inline-block" sx={{ overflow: 'visible' }}>
        {verified &&
          <>
            <div 
              className="absolute"
              style={{ 
                width: size * 0.2,
                height: size * 0.1875,
                transform: 'translateX(-30%) translateY(-10%) rotate(10deg)',
                borderRadius: '100% 0 100% 0',
                backgroundColor: '#4caf50',
                top: '-20%',
                left: '50%',
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
                top: '-15%',
                left: '35%',
                zIndex: 10,
                position: 'absolute',
                overflow: 'visible',
              }}
            />
          </>
        }
        <Avatar
          alt="Profile Image"
          sx={{ width: { xs: 30, md: 35 }, height: { xs: 30, md: 35 }, marginRight: '.5rem' }}
          src={profile_pic_url || undefined}
        />
      </Box>
    </Box>
  );
};

export default TeacherAvatar;

