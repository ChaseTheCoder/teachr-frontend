'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Post from '../../../components/post/post';
import { getData, getDataWithParams } from '../../../services/authenticatedApiCalls';
import { useUser } from '@auth0/nextjs-auth0/client';
import Surface from '../../../components/surface/Surface';
import post from '../../../components/post/post';

export default function Feed() {
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const [userIds, setUserIds] = useState<string[]>([]);
  const [notificationsSorted, setNotificationsSorted] = useState<any[]>([]);

  const { data: profileData, isFetching: isFetchingProfileData, isLoading: isLoadingProfileData, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  });

  const { data: notifications, isFetching: isFetchingNotifications, isLoading: isLoadingNotifications, isError: isErrorNotifications } = useQuery({
    queryKey: ['unreadnotifications'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/unread_notifications/user/${profileData.id}/`),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
  });
  
  const { data: batchProfiles, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesNotifications'],
    queryFn: () => userIds.length > 0 ? getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: !!notifications && notifications.notifications.length > 0,
  });
  
  useEffect(() => {
    if (notifications) {
      let ids: string[] = [];
      notifications.notifications.forEach(notification => {
        if (!ids.includes(notification.initiator)) {
          ids.push(notification.initiator);
        }
      });
      setUserIds(ids);

      const notificationsSorted = notifications.notifications?.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setNotificationsSorted(notificationsSorted);
    }
  }, [notifications]);

  const handleNotificationClick = (notificationId: string) => {
    console.log('clicked ' + notificationId);
    window.location.href = `/post/${notificationId}`;
  }

  const notificationMessage = (notificationType: string) => {
    if(notificationType === 'comment') {
      return 'commented on your post';
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
      <Surface>
      {isLoadingUser || isLoadingProfileData || isFetchingNotifications || isLoadingNotifications || isFetchingNotifications || isFetchingBatchProfiles || isLoadingBatchProfiles ? 
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
        </Box> :
          <List
            sx={{ width: '100%' }}
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Your Notifications
              </ListSubheader>
            }
          >
            {notificationsSorted.map((notification) => {
              const userProfile = batchProfiles?.find(profile => profile.id === notification.initiator);
              const message = notificationMessage(notification.notification_type);
              return (
                <ListItemButton
                  alignItems="center"
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <ListItemAvatar>
                  <Avatar alt="avatar" />
                  </ListItemAvatar>
                  <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>{userProfile?.teacher_name ?? 'User not found'}</strong> {message}
                    </Typography>
                  }
                  />
                </ListItemButton>
              )
            })}
          </List>
        }
      </Surface>
    </Box>
  );
}