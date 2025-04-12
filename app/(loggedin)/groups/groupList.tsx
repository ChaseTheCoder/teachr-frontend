import React, { useEffect } from 'react';
import { useUserContext } from '../../../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../../../services/authenticatedApiCalls';
import { IGroupList, IProfile } from '../../../types/types';
import { Box, Button, Typography } from '@mui/material';
import GroupCard from './groupCard';
import { ActivityLoadingMultiSize } from '../../../components/activityLoading';
import { AddCircleOutline } from '@mui/icons-material';

const GroupList: React.FC = () => {
  const { isLoadingProfile, profileData } = useUserContext();

  const { data: groupData, isFetching: isFetchingGroupData, isLoading: isLoadingGroupData, isError: isErrorGroupData } = useQuery<IGroupList>({
    queryKey: ['groups'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/groups/?user=${profileData?.id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !isLoadingProfile && !!profileData?.id,
  });

  if (isLoadingProfile || isLoadingGroupData) {
    return <ActivityLoadingMultiSize />;
  }

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={.5}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        paddingX={2}
        gap={1}
      >
        <Typography
          variant='h1'
          fontWeight={600}
          fontSize={20}
        >
          Groups
        </Typography>
        <Button
          startIcon={<AddCircleOutline />}
          color='success'
          size='small'
          sx={{
            width: 'fit-content',
            minWidth: 'auto'
          }}
          href='/groups/newgroup'
        >
          Create Group
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
        { groupData && groupData.length > 0 &&
          groupData.map((group: any) => (
            <GroupCard
              key={group.id}
              group={group}
            />
          ))
        }
      </Box>
    </Box>
  );
};

export default GroupList;