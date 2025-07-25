import React, { useMemo, useState } from 'react';
import { Avatar, Box } from '@mui/material';

interface TeacherAvatarProps {
  verified: boolean;
  profilePicUrl?: string | null | undefined;
  cacheKey?: string; // Add cache key prop
}

const TeacherAvatar: React.FC<TeacherAvatarProps> = ({ verified, profilePicUrl, cacheKey }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate stable URL for caching
  const imageUrl = useMemo(() => {
    if (!profilePicUrl) return undefined;
    return `${profilePicUrl}?cache=${cacheKey || 'default'}`;
  }, [profilePicUrl, cacheKey]);

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
                backgroundColor: '#246928',
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
          src={imageUrl}
          onLoad={() => setIsLoaded(true)}
        />
      </Box>
    </Box>
  );
};

export default TeacherAvatar;

