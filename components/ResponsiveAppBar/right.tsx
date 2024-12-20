'use client'

import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Link from 'next/link';
import TeachrLogo from '../../public/TeachrLogo.svg';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../services/authenticatedApiCalls';
import { Add, ArrowForwardIos } from '@mui/icons-material';
import { useRouter } from 'next/router';
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
  let pathname = usePathname()
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
            <Button
              variant='contained'
              startIcon={<Add />}
              href='/new-post'
              color='success'
              sx={{  display: { xs: 'flex', md: 'none' } }}
            >
              Post
            </Button>
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
              {settings.map((setting) => (
              <a
                key={setting.title}
                href={setting.link}
              >
                <MenuItem
                  onClick={handleCloseUserMenu}
                >
                  <Typography textAlign="center">{setting.title}</Typography>
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