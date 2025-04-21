'use client'

import * as React from 'react';
import { Box, MenuItem, IconButton, Drawer, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { getDataNoToken } from '../../services/unauthenticatedApiCalls';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useUserContext } from '../../context/UserContext';

export default function Policies({ children }: { children: React.ReactNode }) {
  const { auth0Id, isLoadingUser } = useUserContext();
  const isStaff = React.useMemo(() => {
    if (isLoadingUser || !auth0Id) return false;
    const allowedStaffIds = process.env.NEXT_PUBLIC_ALLOWED_STAFF_AUTH0_IDS?.split(',') || [];
    return allowedStaffIds.includes(auth0Id);
  }, [auth0Id, isLoadingUser]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedPolicy, setSelectedPolicy] = React.useState<number>(0);

  const { data: policiesList, isLoading: isLoadingPoliciesList } = useQuery({
    queryKey: ['policiesList'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/policies/`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedPolicy(index);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const menuContent = (
    <Box>
      {policiesList?.map((policy: any, index: number) => (
        <MenuItem 
          key={index}
          onClick={() => handleMenuItemClick(index)}
          selected={index === selectedPolicy}
          sx={{ 
            mb: 1,
            borderRadius: 1,
            '&.Mui-selected': {
              backgroundColor: 'action.selected'
            }
          }}
        >
          <Link
            href={`/policies/${policy.url_path_name}`}
          >
            {policy.type}
          </Link>
        </MenuItem>
      ))}
      {isStaff && (
        <MenuItem 
          onClick={() => handleMenuItemClick(-1)}
          selected={selectedPolicy === -1}
          sx={{ 
            mb: 1,
            borderRadius: 1,
            '&.Mui-selected': {
              backgroundColor: 'action.selected'
            }
          }}
        >
          <Link
            href={`/policies/admin-view`}
          >
            Admin View
          </Link>
        </MenuItem>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Mobile menu button */}
      {isMobile && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Desktop sidebar */}
        {!isMobile && (
          <Box sx={{
            borderRight: '1px solid',
            borderColor: 'divider',
            p: 2
          }}>
            {menuContent}
          </Box>
        )}

        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { width: '250px', p: 2 },
          }}
        >
          {menuContent}
        </Drawer>

        {/* Main content */}
        <Box sx={{ 
          flex: 1, 
          p: 2,
          width: { xs: '100%', md: 'calc(100% - 250px)' }
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}