'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, getDataWithParams, patchData } from '../../../services/authenticatedApiCalls';
import { useUser } from '@auth0/nextjs-auth0/client';
import Surface from '../../../components/surface/Surface';
import { timeAgo } from '../../../utils/time';

export default function Notifications() {
  const queryClient = useQueryClient();
  const { user, error, isLoading: isLoadingUser } = useUser();
  const auth0Id = user?.sub;
  const [userIds, setUserIds] = useState<string[]>([]);
  const [notificationId, setNotificationId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [currentProfiles, setCurrentProfiles] = useState([]);
  const [notificationsDisplayed, setNotificationsDisplayed] = useState([]); 
  const [disableSeeMore, setDisableSeeMore] = useState(false);
  const handleSeeMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
  const { data: profileData, isFetching: isFetchingProfileData, isLoading: isLoadingProfileData, isError: isErrorProfileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_auth0/${auth0Id}`),
    staleTime: 1000 * 60 * 60,
    enabled: !!auth0Id,
  });

  const { data: notificationData, isFetching: isFetchingNotificationData, isLoading: isLoadingNotificationData, isError: isErrorNotificationData } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/notifications/user/${profileData.id}/`, 'page', [page]),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
  });

  
  const { data: batchProfiles, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesNotifications', userIds],
    queryFn: () => userIds.length > 0 ? getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: !!userIds,
  });
  
  const mutationNotificationRead = useMutation({
    mutationFn: () => {
      return patchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/notification/${notificationId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadnotifications'] });
      window.location.href = `/post/${notificationId}`;
    },
    onError: (error) => {
      console.error('Error deleting post:', error);
    },
    onSettled: () => {
    }
  });
  
  useEffect(() => {
    if (notificationData && notificationData.length > 0) {
      setNotificationsDisplayed((prevNotifications) => [...prevNotifications, ...notificationData]);
      let newUserIds = [];
      notificationData
        .forEach((notification) => {
          if(!userIds.includes(notification.initiator)) {
            newUserIds.push(notification.initiator);
          }
        }
      );
      if(newUserIds.length > 0) {
        setUserIds(newUserIds);
      }
    }
    if (notificationData && notificationData.length < 10) {
      setDisableSeeMore(true);
    }
  }, [notificationData]);

  useEffect(() => {
    if (batchProfiles) {
      setCurrentProfiles((prevProfiles) => [...prevProfiles, ...batchProfiles]);
    }
  }, [batchProfiles]);

  const handleNotificationClick = (notificationUrl: string, notificationRead: boolean) => {
    notificationRead ?
      mutationNotificationRead.mutate() :
      window.location.href = notificationUrl;
  }

  const createNotificationMessage = (notificationType: string) => {
    if(notificationType === 'comment') {
      return 'commented on your post';
    }
  }

  const createNotificationUrl = (notificationType: string, urlId: string) => {
    if(notificationType === 'comment') {
      return `/post/${urlId}`;
    }
  }


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={.5}>
      <Surface>
      {isLoadingUser || isLoadingProfileData || isFetchingProfileData || (isLoadingNotificationData && page === 1) || (isFetchingNotificationData && page === 1) || isFetchingBatchProfiles || isLoadingBatchProfiles ? 
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
          <Skeleton variant='rounded' height={80} />
        </Box> :
          <>
            <List
              sx={{ width: '100%' }}
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Your Notifications
                </ListSubheader>
              }
            >
              {notificationsDisplayed.map((notification) => {
                const userProfile = currentProfiles?.find(batchProfile => batchProfile.id === notification.initiator);
                const message = createNotificationMessage(notification.notification_type);
                const notificationUrl = createNotificationUrl(notification.notification_type, notification.url_id);
                return (
                  <ListItemButton
                    alignItems="center"
                    key={notification.id}
                    onClick={() => {
                      setNotificationId(notification.id);
                      handleNotificationClick(notificationUrl, notification.read);
                    }}
                  >
                    <ListItemAvatar>
                    <Avatar alt="avatar" />
                    </ListItemAvatar>
                    <ListItemText
                    primary={
                      <Typography variant="body1" color={notification.read ? 'textSecondary' : 'textPrimary'}>
                        <strong>{userProfile?.teacher_name ?? 'User not found'}</strong> {message} {timeAgo(notification.timestamp)}
                      </Typography>
                    }
                    />
                  </ListItemButton>
                )
              })}
            </List>
            <Button onClick={handleSeeMore} disabled={disableSeeMore || isFetchingNotificationData || isLoadingNotificationData}>
              See more notifications
            </Button>
          </>
        }
      </Surface>
    </Box>
  );
}