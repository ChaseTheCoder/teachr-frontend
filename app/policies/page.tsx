'use client'

import * as React from 'react';
import { Typography, Box, MenuItem } from '@mui/material';
import { getDataNoToken } from '../../services/unauthenticatedApiCalls';
import { useQuery } from '@tanstack/react-query';

export default function Policies() {
  const [selectedPolicy, setSelectedPolicy] = React.useState<number>(0);

  const { data: policiesList, isLoading: isLoadingPoliciesList } = useQuery({
    queryKey: ['policiesList'],
    queryFn: () => getDataNoToken(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/policies/`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const handleMenuItemClick = (index: number) => {
    setSelectedPolicy(index);
  };

  return (
    <Box sx={{ display: 'flex', p: 2 }}>
      {/* Left side menu */}
      <Box sx={{ 
        width: '250px', 
        borderRight: '1px solid',
        borderColor: 'divider',
        mr: 3
      }}>
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
            {policy.type}
          </MenuItem>
        ))}
      </Box>

      {/* Right side content */}
      <Box sx={{ flex: 1 }}>
        {policiesList && (
          <Typography>
            {policiesList[selectedPolicy]?.content}
          </Typography>
        )}
      </Box>
    </Box>
  );
}