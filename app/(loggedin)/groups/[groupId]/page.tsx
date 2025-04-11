'use client'

import { useEffect } from 'react';
import { Box, Chip, Grid, Skeleton, useMediaQuery, useTheme } from "@mui/material";
import { Add } from '@mui/icons-material';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getData } from "../../../../services/authenticatedApiCalls";
import { IProfile } from "../../../../types/types";
import { useUserContext } from "../../../../context/UserContext";
import GroupInformation from "./groupInformation";
import { useState } from "react";
import GroupActivity from "./groupActivity";
import GroupAbout from "./groupAbout";
import AdminSettings from "./adminSettings";
import GroupMembership from "./groupMembership";
import Link from 'next/link';

export default function GroupLayout({
  params
}: {
  params: { groupId: string };
}) {
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));
  const queryClient = useQueryClient()
  const { groupId } = params;
  const [sectionSelected, setSectionSelected] = useState('activity');

  useEffect(() => {
    if (isMediumScreen && sectionSelected === 'about') {
      setSectionSelected('activity');
    }
  }, [isMediumScreen, sectionSelected]);
  
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
  });

  const { data: groupData, isFetching: isFetchingGroupData, isLoading: isLoadingGroupData, isError: isErrorGroupData } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/${groupId}/?user=${profileData?.id}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!user && !!profileData?.id,
  });

  if(isLoadingUser || isLoadingProfileData || isLoadingGroupData) return (<Skeleton variant='text' sx={{ height: '150px' }} />);
  
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={9}>
        <GroupInformation
          groupData={groupData}
          profileId={profileData?.id}
        />
        <Box 
          sx={{ 
            display: 'flex',
            overflowX: 'auto',
            flexWrap: 'nowrap',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            '-ms-overflow-style': 'none', // For Internet Explorer and Edge
            'scrollbar-width': 'none', // For Firefox
          }}
          gap={1}
          my={1}
          pr={1}
        >
          <Chip
            label="Activity"
            color="success"
            size="small"
            variant={sectionSelected === 'activity' ? 'filled' : 'outlined'}
            onClick={() => setSectionSelected('activity')}
            clickable
            sx={{ marginLeft: 1 }}
          />
          {groupData.is_member && (
            <Link href={`/newpost/?groupId=${groupId}`}>
              <Chip
                label="Post in Group"
                color="success"
                size="small"
                variant='outlined'
                clickable
                icon={<Add />}
              />
            </Link>
          )}
            <Chip
              label="About"
              color="success"
              size="small"
              sx={{ display: { xs: 'flex', md: 'none' } }}
              variant={sectionSelected === 'about' ? 'filled' : 'outlined'}
              onClick={() => setSectionSelected('about')}
              clickable
            />
          {groupData.is_member && (
            <Chip
                label="Membership"
                color="success"
                size="small"
                variant={sectionSelected === 'membership' ? 'filled' : 'outlined'}
                onClick={() => setSectionSelected('membership')}
                clickable
            />
          )}
          {groupData.is_admin && (
            <Chip
              label="Admin Settings"
              color="success"
              size="small"
              variant={sectionSelected === 'settings' ? 'filled' : 'outlined'}
              onClick={() => setSectionSelected('settings')}
              clickable
            />
          )}
        </Box>
        {sectionSelected === 'activity' && (
          <GroupActivity
            isPublic={groupData.is_public}
            isMember={groupData.is_member}
            groupId={groupId}
            profileId={profileData?.id}
          />
        )}
        {sectionSelected === 'about' && (
          <GroupAbout
            about={groupData.about}
            rules={groupData.rules}
          />
        )}
        {(groupData.is_member && sectionSelected === 'membership') && (
          <GroupMembership
            groupId={groupId}
            profileId={profileData?.id}
            isAdmin={groupData.is_admin}
            isPublic={groupData.is_public}
            setSectionSelected={setSectionSelected}
          />
        )}
        {sectionSelected === 'settings' && (
          <AdminSettings
            title={groupData.title}
            about={groupData.about}
            rules={groupData.rules}
            groupId={groupId}
            profileId={profileData?.id}
            isPublic={groupData.is_public}
            isAdmin={groupData.is_admin}
            setSectionSelected={setSectionSelected}
          />
        )}        
      </Grid>
      <Grid item display={{ xs: 'none', sm: 'none', md: 'block' }} md={3}>
        <GroupAbout
          about={groupData.about}
          rules={groupData.rules}
        />
      </Grid>
    </Grid>
  );
}