import { AdminPanelSettings, Group } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { postOrPatchData } from "../../../services/authenticatedApiCalls";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface JoinGroupProps {
  groupId: string;
  isPublic: boolean;
  isMember: boolean;
  isPending: boolean;
  isAdmin: boolean;
  profileId: string;
}

const JoinGroup: React.FC<JoinGroupProps> = ({
  groupId,
  isPublic,
  isPending,
  isMember,
  isAdmin,
  profileId
}) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const mutationPatch = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const response = await postOrPatchData(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/${groupId}/join/?user=${profileId}`, 
          'PATCH'
        );
        return response;
      } catch (error) {
        // If error is due to empty response, treat as success
        if (error.message.includes('Unexpected end of JSON input')) {
          return null;
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['group', groupId]})
      queryClient.refetchQueries({ queryKey: ['groups']})
    },
    onError: (error) => {
      console.error('Error updating group membership:', error);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  if(isPending) {
    return (
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        gap={1}
      >
        <Group color='warning' fontSize='small' />
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 14 },
          }}
          color='textSecondary'
        >
          Your request to join this group is pending
        </Typography>
      </Box>
    )
  } 

  if(isMember) {
    return (
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        gap={1}
      >
        {isAdmin ?
          <AdminPanelSettings color='success' fontSize='small' /> :
          <Group color='success' fontSize='small' />}
        <Typography
          sx={{
            fontSize: { xs: 12, sm: 14 },
          }}
          color='textSecondary'
        >
          {isAdmin? 'You are an Admin' : 'You are a member'}
        </Typography>
      </Box>
    )
  } 

  if(isPending) {
    return (
      <Button
        color='success'
        size='small'
        variant='contained'
        sx={{ width: 'fit-content', minWidth: 'auto' }}
        disabled
      >
        Request Pending
      </Button>
    )
  }
  return (
    <LoadingButton
      color='success'
      size='small'
      variant='contained'
      sx={{ width: 'fit-content', minWidth: 'auto' }}
      loading={isLoading}
      onClick={() => mutationPatch.mutate()}
    >
      {isPublic ? 'Join Group' : 'Request to Join'}
    </LoadingButton>
  );
}

export default JoinGroup;