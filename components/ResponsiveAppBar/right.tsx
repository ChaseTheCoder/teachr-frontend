'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';import { Badge } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData } from '../../services/authenticatedApiCalls';
import { useEffect, useState } from 'react';
import { IProfile } from '../../types/types';
import TeacherAvatar from '../post/avatar';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const settings = [
  {
    title: 'Profile',
    link: '/profile'
  },
  {
    title: 'Logout',
    link: '/api/auth/logout/'
  }];

export default function Right({ auth0Id }: { auth0Id: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuList, setMenuList] = useState(settings);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [teacherName, setTeacherName] = useState('')

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const queryClient = useQueryClient();
  
  const { data: profileData, isFetching: isFetchingProfileData, isLoading: isLoadingProfileData, isError: isErrorProfileData, error: errorProfileData } = useQuery<IProfile>({
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

  useEffect(() => {
    if (!isLoadingProfileData && !isFetchingProfileData && !profileData && auth0Id) {
      router.push('/signup');
    }
  }, [isLoadingProfileData, isFetchingProfileData, profileData, auth0Id, router]);

  const { data: notifications, isFetching: isFetchingNotifications, isLoading: isLoadingNotifications, isError: isErrorNotifications } = useQuery({
    queryKey: ['unreadnotifications'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unread_notification_count/user/${profileData.id}/`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  React.useEffect(() => {
    if (profileData) {
      setMenuList([
        {
          title: 'Profile',
          link: `/profile/${profileData.id}`
        },
        {
          title: 'Logout',
          link: '/api/auth/logout/'
        }
      ])
    }
    if(profileData?.teacher_name){
      setTeacherName(profileData.teacher_name)
    }
  }, [profileData])

  useEffect(() => {
    if(isErrorProfileData && errorProfileData) {
      console.error(errorProfileData)
    }
  }, [isErrorProfileData, errorProfileData])
  return (
    <Box sx={{ flexGrow: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={2}>
        <Link
          href='/notifications'
          passHref
        >
          <IconButton
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Badge badgeContent={notifications?.count ?? 0} color='error'>
              <NotificationsNoneIcon color='action' />
            </Badge>
          </IconButton>
        </Link>
        {/* <Typography color='textPrimary' fontWeight='bold' sx={{  display: { xs: 'none', md: 'flex' } }}>{teacherName}</Typography> */}
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <TeacherAvatar
              verified={profileData?.verified}
              profilePicUrl={profileData?.profile_pic_url}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {menuList.map((menuItem) => (
            <Link
              key={menuItem.title}
              href={menuItem.link}
            >
              <MenuItem
                onClick={handleCloseUserMenu}
              >
                <Typography textAlign="center">{menuItem.title}</Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    </Box>
  )
}