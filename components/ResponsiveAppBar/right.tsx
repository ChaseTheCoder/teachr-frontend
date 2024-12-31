'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';import { Badge, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../services/authenticatedApiCalls';
import { Add, ArrowForwardIos } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

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
  let pathname = usePathname();
  const [menuList, setMenuList] = React.useState(settings);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const { data: profileData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })

  const { data: notifications, isFetching: isFetchingNotifications, isLoading: isLoadingNotifications, isError: isErrorNotifications } = useQuery({
    queryKey: ['unreadnotifications'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unread_notification_count/user/${profileData.id}/`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
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
  }, [profileData])

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={2}>
        { pathname === '/' ?
          (<Button
            variant='outlined'
            href='/feed'
            color='success'
            endIcon={<ArrowForwardIos />}
          >
            Go to App
          </Button>) :
          (<>
            <IconButton
              color='success'
              href='/new-post'
              sx={{ 
              display: { xs: 'flex', md: 'none' },
              backgroundColor: 'green',
              color: 'white',
              '&:hover': {
                backgroundColor: 'darkgreen'
              }
              }}
            >
              <Add />
            </IconButton>
            <IconButton
              href='/notifications'
            >
              <Badge badgeContent={notifications?.count ?? 0} color='error'>
                <NotificationsNoneIcon color='action' />
              </Badge>
            </IconButton>
            {
              profileData?.teacher_name &&
              <Typography color='textPrimary' fontWeight='bold' sx={{  display: { xs: 'none', md: 'flex' } }}>{profileData.teacher_name}</Typography>
            }
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt='Profile Icon' />
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
              <a
                key={menuItem.title}
                href={menuItem.link}
              >
                <MenuItem
                  onClick={handleCloseUserMenu}
                >
                  <Typography textAlign="center">{menuItem.title}</Typography>
                </MenuItem>
              </a>
              ))}
            </Menu>
          </>)
        }
      </Box>
    </Box>
  )
}