'use client'

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Image from 'next/image';
import Link from 'next/link';
import TeacherLogo from '../../public/TeacherLogo.svg';
import { Button } from '@mui/material';
import Right from './right';
import { ArrowForwardIos } from '@mui/icons-material';
import { usePathname } from 'next/navigation';
import { useUserContext } from '../../context/UserContext';
import SearchBar from './searchBar';

const pages = [
  {
    title: 'Feed',
    link: '/feed'
  },
];

function ResponsiveAppBar() {
  let pathname = usePathname();
  const { auth0Id, user } = useUserContext();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderRadius: 4 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* <Box sx={{  display: { xs: 'flex', md: 'none' } }}>
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
          </Box> */}

          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }} >
            <Box sx={{ display: 'flex', mr: 1 }}>
              <Link href={user ? '/feed' : '/'}>
                <Image
                  priority
                  src={TeacherLogo}
                  alt='Teachr Lounge logo'
                  height={38}
                />
              </Link>
            </Box>

            { pathname !== '/' && <SearchBar /> }
            
            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                { pathname !== '/signup' && (
                  pathname === '/' ? (
                    <>
                      {!auth0Id && 
                        <Button
                          color='success'
                          sx={{ marginRight: 2 }}
                        >
                          <a href='/api/auth/login'>
                          Log In
                          </a>
                        </Button>
                      }
                      <Link href='/feed'>
                        <Button
                          variant='outlined'
                          color='success'
                          endIcon={<ArrowForwardIos />}
                        >
                        Go to App
                        </Button>
                      </Link>
                    </>
                  ) : (
                    auth0Id ? 
                    <Right auth0Id={auth0Id} /> 
                    :
                    <Link href='/api/auth/login'>
                      <Button
                      color='success'
                      size='small'
                      sx={{ flex: 'none', whiteSpace: 'nowrap' }}
                      >
                      Log In
                      </Button>
                    </Link>
                  )
                )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
