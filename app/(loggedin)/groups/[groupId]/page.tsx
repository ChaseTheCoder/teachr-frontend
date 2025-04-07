'use client'

import { Box, Button, Grid, Skeleton } from "@mui/material";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { getData } from "../../../../services/authenticatedApiCalls";
import { IProfile } from "../../../../types/types";
import { useUserContext } from "../../../../context/UserContext";
import GroupInformation from "./groupInformation";
import { useState } from "react";
import GroupActivity from "./groupActivity";
import GroupAbout from "./groupAbout";
import AdminSettings from "./adminSettings";
import GroupMembership from "./groupMembership";

export default function GroupLayout({
  params
}: {
  params: { groupId: string };
}) {
  const { user, auth0Id, isLoadingUser } = useUserContext();
  const queryClient = new QueryClient()
  const { groupId } = params;
  const [sectionSelected, setSectionSelected] = useState('activity');
  
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
    queryKey: ['groups', groupId, profileData?.id],
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
        <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={2}>
          <Button
            color='success'
            size='small'
            onClick={() => setSectionSelected('activity')}
          >
            Activity
          </Button>
          <Button
            color='success'
            size='small'
            onClick={() => setSectionSelected('about')}
          >
            About
          </Button>
          {groupData.is_member &&
            <Button
              color='success'
              size='small'
              onClick={() => setSectionSelected('membership')}
            >
              Membership
            </Button>
          }
          {groupData.is_admin && 
            <Button
              color='success'
              size='small'
              onClick={() => setSectionSelected('settings')}
            >
              Admin Settings
            </Button>
          }
        </Box>
        {sectionSelected === 'activity' && (
          <GroupActivity
            isPublic={groupData.is_public}
            isMember={groupData.is_member}
          />
        )}
        {sectionSelected === 'about' && (
          <GroupAbout
            about={groupData.about}
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
            groupId={groupId}
            profileId={profileData?.id}
            isPublic={groupData.is_public}
            isAdmin={groupData.is_admin}
            setSectionSelected={setSectionSelected}
          />
        )}        
      </Grid>
    </Grid>
  );
}