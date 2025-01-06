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
import TeachrLogo from '../../public/TeachrLogo.svg';
import { Button } from '@mui/material';
import Right from './right';
import { ArrowForwardIos } from '@mui/icons-material';
import { usePathname } from 'next/navigation';

const pages = [
  {
    title: 'Feed',
    link: '/feed'
  },
  // {
  //   title: 'Plans',
  //   link: '/plans'
  // }, 
];

function ResponsiveAppBar() {
  let pathname = usePathname();
  const { user, error, isLoading: userLoading } = useUser();
  const [auth0Id, setAuth0Id] = useState<string | null>(null);

  useEffect(() => {
    if (user && !userLoading && !auth0Id) {
      setAuth0Id(user.sub);
    }
  }, [user, userLoading, auth0Id]);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [userData, setUserData] = useState(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    if(user && !userLoading){
      setUserData(user);
    }
  }, [user, userLoading]);

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
              <Link href={userData ? '/feed' : '/'}>
                <Image
                  priority
                  src={TeachrLogo}
                  alt='Teachr Lounge logo'
                  height={38}
                />
              </Link>
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              { pathname === '/' ?
                  <>
                    {auth0Id && 
                    <Button
                      color='success'
                    >
                      <a href='/api/auth/login'>
                        Log In
                      </a>
                    </Button>}
                    <Button
                    variant='outlined'
                    href='/feed'
                    color='success'
                    endIcon={<ArrowForwardIos />}
                    >
                      Go to App
                    </Button>
                  </>
                :
                auth0Id ? 
                  <Right
                    auth0Id={auth0Id}
                  /> 
                  :
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
