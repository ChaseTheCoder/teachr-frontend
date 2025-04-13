'use client'

import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Skeleton, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getData, getDataWithParams, patchData } from '../../../services/authenticatedApiCalls';
import Surface from '../../../components/surface/Surface';
import { timeAgo } from '../../../utils/time';
import { IProfile } from '../../../types/types';
import { useUserContext } from '../../../context/UserContext';
import { useRouter } from 'next/navigation';

export default function Notifications() {
  const queryClient = useQueryClient();
  const { auth0Id, isLoadingUser } = useUserContext();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [currentProfiles, setCurrentProfiles] = useState([]);
  const [notificationsDisplayed, setNotificationsDisplayed] = useState([]); 
  const [disableSeeMore, setDisableSeeMore] = useState(false);
  const router = useRouter();

  const handleSeeMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  
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

  const { data: notificationData, isFetching: isFetchingNotificationData, isLoading: isLoadingNotificationData, isError: isErrorNotificationData } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/notifications/user/${profileData.id}/`, 'page', [page]),
    staleTime: 1000 * 60 * 60,
    enabled: !!profileData,
  });
  console.log('notificationData', notificationData);
  console.log('error notifications', isErrorNotificationData);

  
  const { data: batchProfiles, isFetching: isFetchingBatchProfiles, isLoading: isLoadingBatchProfiles, isError: isErrorBatchProfiles } = useQuery({
    queryKey: ['batchProfilesNotifications', userIds],
    queryFn: () => userIds.length > 0 ? getDataWithParams(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile_batch/`, 'user_id', userIds) : Promise.resolve([]),
    staleTime: 1000 * 60 * 60,
    enabled: !!userIds,
  });
  
  const mutationNotificationRead = useMutation({
    mutationFn: (notificationId: string) => {
      return patchData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/notification/${notificationId}/`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadnotifications'] });
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
      let newUserIds = new Set(userIds);
      notificationData.forEach((notification) => {
        if (notification.initiator && !userIds.includes(notification.initiator) && notification.initiator !== null) {
          newUserIds.add(notification.initiator);
        }
      });
      setUserIds(Array.from(newUserIds));
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

  const handleNotificationClick = async (notificationUrl: string, notificationId: string, notificationRead: boolean) => {
    if (notificationRead) {
      router.push(notificationUrl);
    } else {
      mutationNotificationRead.mutate(notificationId, {
        onSettled: () => {
          router.push(notificationUrl);
        }
      });
    }
  };

  const createNotificationMessage = (notificationType: string) => {
    if(notificationType === 'comment') {
      return 'commented on your post';
    } else if(notificationType === 'upvote_post') {
      return 'Someone upvoted your post';
    } else if(notificationType === 'upvote_comment') {
      return 'Someone upvoted your comment';
    } else if(notificationType === 'upvote') {
      return 'Someone upvoted';
    } else if (notificationType === 'group_invite_accepted') {
      return 'Your group invite was accepted';
    }
  }

  const createNotificationUrl = (urlId: string, notificationType: string) => {
    if(notificationType === 'group_invite_accepted') return `/groups/${urlId}`;
    return `/post/${urlId}`;
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
            <Box sx={{ width: '100%' }}>
              <Typography 
                component="div" 
                id="nested-list-subheader" 
                sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '1rem', 
                  marginBottom: 1, 
                  color: 'text.secondary' 
                }}
              >
                Your Notifications
              </Typography>
              {notificationsDisplayed.map((notification) => {
                const userProfile = currentProfiles?.find(batchProfile => batchProfile.id === notification.initiator);
                const message = createNotificationMessage(notification.notification_type);
                const notificationUrl = createNotificationUrl(notification.url_id, notification.notification_type);
                
                return (
                  <Box
                    key={notification.id}
                    onClick={() => handleNotificationClick(notificationUrl, notification.id, notification.read)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: 2,
                      cursor: 'pointer',
                      backgroundColor: notification.read ? 'transparent' : 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      }
                    }}
                  >
                    <Avatar 
                      alt={userProfile?.teacher_name || 'avatar'} 
                      src={userProfile?.profile_pic_url}
                      sx={{ marginRight: 2 }}
                    />
                    <Typography 
                      color={notification.read ? 'text.secondary' : 'text.primary'}
                    >
                      {notification.notification_type === 'comment' && (
                        <strong>{userProfile?.teacher_name ?? 'User not found'}</strong>
                      )} {message} {timeAgo(notification.timestamp)}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Button onClick={handleSeeMore} disabled={disableSeeMore || isFetchingNotificationData || isLoadingNotificationData}>
              See more notifications
            </Button>
          </>
        }
      </Surface>
    </Box>
  );
}