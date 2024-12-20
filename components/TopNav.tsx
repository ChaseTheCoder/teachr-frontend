'use client'

import * as React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Link from 'next/link';
import TeachrLogo from '../public/TeachrLogo.svg';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../services/authenticatedApiCalls';
import { Add } from '@mui/icons-material';

const pages = [
  {
    title: 'Feed',
    link: '/feed'
  },
  {
    title: 'Plans',
    link: '/plans'
  }, 
];
const settings = [
  {
    title: 'Profile',
    link: '/profile'
  },
  {
    title: 'Logout',
    link: '/api/auth/logout/'
  }];

function ResponsiveAppBar() {
  const [profile, setProfile] = React.useState(true);
  const { user, error, isLoading: userLoading } = useUser();
  const auth0Id = user?.sub;
  const { data: profileData, isFetching, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  })
  React.useEffect(() => {
    if (!isFetching && !isLoading && user) {
      setProfile(profileData ? true : false)
    }
  }, [isFetching, isLoading, profileData, user])
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderRadius: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Box sx={{  display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Link href={page.link}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
            <Box sx={{ display: 'flex', mr: 1 }}>
              <Link href={user ? '/feed' : '/'}>
                <Image
                  priority
                  src={TeachrLogo}
                  alt='Teachr Lounge logo'
                  height={38}
                />
              </Link>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              { user ?
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={2}>
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
                  </Box>  :
                <Button
                  color='success'
                >
                  <a href='/api/auth/login'>
                    Log In
                  </a>
                </Button>
              }
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
