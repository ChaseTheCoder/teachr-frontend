import React, { useEffect, useState } from 'react';
import { Badge, BottomNavigation, BottomNavigationAction } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Add, Group, Home } from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData } from '../../services/authenticatedApiCalls';
import { IProfile } from '../../types/types';
import { useUserContext } from '../../context/UserContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const BottomMobileNav = () => {
  const { auth0Id, user } = useUserContext();
  const queryClient = useQueryClient();
  let pathname = usePathname();
  const [visible, setVisible] = useState(true);
  let lastScrollY = 0;

  const { data: profileData, isFetching: isFetchingProfileData, isLoading: isLoadingProfileData, isError: isErrorProfileData } = useQuery<IProfile>({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!auth0Id,
    initialData: () => {
      return queryClient.getQueryData(['profile']);
    },
  })

  const { data: notifications, isFetching: isFetchingNotifications, isLoading: isLoadingNotifications, isError: isErrorNotifications } = useQuery({
    queryKey: ['unreadnotifications'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unread_notification_count/user/${profileData.id}/`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  const handleScroll = () => {
    if (window.scrollY === 0) {
      // At the top of the page
      setVisible(true);
    } else if (window.scrollY > lastScrollY) {
      // Scrolling down
      setVisible(false);
    } else {
      // Scrolling up
      setVisible(true);
    }
    lastScrollY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <BottomNavigation
      showLabels
      sx={{
        position: 'fixed',
        bottom: visible ? 0 : '-56px', // Adjust based on the height of the BottomNavigation
        width: '100%',
        transition: 'bottom 0.3s',
        zIndex: 1000,
        display: { xs: 'flex', md: 'none' },
      }}
    >
      <Link
        href='/feed'
        passHref
      >
        <BottomNavigationAction 
          label='Home'
          icon={<Home />}
          sx={{ color: pathname === '/feed' && 'success.main' }}
        />
      </Link>
      <Link
        href='/groups'
        passHref
      >
        <BottomNavigationAction 
          label='Groups'
          disabled={!profileData}
          icon={<Group />}
          sx={{ color: pathname.startsWith('/groups') && 'success.main' }}
        />
      </Link>
      <Link
        href='/newpost'
        passHref
      >
        <BottomNavigationAction
          label="Post"
          icon={<Add />}
          sx={{ color: pathname === '/newpost' && 'success.main' }}
        />
      </Link>
      <Link
        href='/notifications'
        passHref
      >
        <BottomNavigationAction
          disabled={!profileData}
          label="Notifications"
          icon={
            <Badge badgeContent={notifications?.count ?? 0} color='error' >
              <NotificationsIcon />
            </Badge>
          }
          sx={{ color: !profileData ? '#e0e0e0' : pathname === '/notifications' && 'success.main' }}
        />
      </Link>
    </BottomNavigation>
  );
};

export default BottomMobileNav;