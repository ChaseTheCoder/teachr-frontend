'use client'

import { getData } from "../../../../services/authenticatedApiCalls";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import Post from "../../../../components/post/post";

interface GroupActivityProps {
  isPublic: boolean;
  isMember: boolean;
  groupId: string;
  profileId: string;
}
const GroupActivity: React.FC<GroupActivityProps> = ({isPublic, isMember, groupId, profileId}) => {
  const { data: groupPosts, isLoading: isLoadingGroupPosts, isError: isErrorGroupPosts } = useQuery({
    queryKey: ['group', 'posts', groupId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/posts/group/${groupId}/?user_id=${profileId}`),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!profileId && !!groupId,
  });

  if(!isPublic && !isMember) {
    return (
      <div>
        <Typography
          fontSize={{xs: 24, md: 28}}
          fontWeight='bold'
          color='textSecondary'
          mt={2}
        >
          Join the group to see activity
        </Typography>
      </div>
    );
  }

  if(isLoadingGroupPosts) {
    return (
      <div>
        <Typography
          fontSize={{xs: 24, md: 28}}
          fontWeight='bold'
          color='textSecondary'
          mt={2}
        >
          Loading activity...
        </Typography>
      </div>
    );
  }

  return (
    <>
      {groupPosts && groupPosts.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
          {groupPosts.map((post) => (
            <Post
              key={post.id}
              post={post}
              profile={post.user}
            />
          ))}
        </Box>
      ) : (
        <div>
          <Typography
            fontSize={{xs: 24, md: 28}}
            fontWeight='bold'
            color='textSecondary'
            mt={2}
          >
            No activity yet
          </Typography>
        </div>
      )}
    </>
  );
}

export default GroupActivity;