import { Group } from "@mui/icons-material";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getData, postOrPatchData } from "../../../../services/authenticatedApiCalls";
import { IGroupMembers } from "../../../../types/types";
import MemberCard from "./groupMembershipCard";

interface GroupMembershipProps {
  groupId: string;
  isAdmin?: boolean;
  profileId: string;
  isPublic?: boolean;
  setSectionSelected?: (section: string) => void;
}

const GroupMembership: React.FC<GroupMembershipProps> = ({ groupId, isAdmin, profileId, isPublic, setSectionSelected }) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: membersData, isLoading: isLoadingMembers } = useQuery<IGroupMembers>({
    queryKey: ['groupMembers', groupId],
    queryFn: () => getData(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/${groupId}/members/?user=${profileId}`),
    enabled: !!groupId && !!profileId,
  });

  const leaveGroupMutation = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      try {
        const response = await postOrPatchData(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/${groupId}/leave/?user=${profileId}`,
          'PATCH'
        );
        return response;
      } catch (error) {
        if (error.message.includes('Unexpected end of JSON input')) {
          return null;
        }
        throw error;
      }
    },
    onSuccess: () => {
      if (setSectionSelected) {
        setSectionSelected('activity');
      }
      queryClient.refetchQueries({ queryKey: ['groups', groupId, profileId] });
    },
    onError: (error) => {
      console.error('Error leaving group:', error);
    },
    onSettled: () => {
      setIsLoading(false);
    }
  });

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          paddingX: 2,
          paddingY: 1.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
        gap={2}
      >
        <Typography
          fontSize={{ xs: 12, md: 14 }}
          fontWeight='bold'
        >
          Your Membership
        </Typography>
        {!isAdmin && (
          <Box
            display='flex'
            flexDirection='column'
            gap={.5}
          >
            <LoadingButton
              color='error'
              size='small'
              variant='outlined'
              sx={{ width: 'fit-content', minWidth: 'auto' }}
              loading={isLoading}
              onClick={() => leaveGroupMutation.mutate()}
            >
              Leave Group
            </LoadingButton>
            <Typography
              sx={{ fontSize: { xs: 12, sm: 14 } }}
              color='textSecondary'
            >
              {isPublic ? 'You can rejoin this group at any time.' : 'This group is private. You will have to request to join again.'}
            </Typography>
          </Box>
        )}
        {isAdmin && (
          <Typography
            sx={{ fontSize: { xs: 12, sm: 14 } }}
            color='textSecondary'
          >
            You are an Admin of this group. You must delete the group to leave in ADMIN SETTINGS. More updates coming soon to allow more admin.
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          paddingX: 2,
          paddingY: 1.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoadingMembers ? (
          <Typography
            fontSize={{ xs: 12, md: 14 }}
            fontWeight='bold'
            color='textSecondary'
          >
            Loading members...
          </Typography>
        ) : (
          <>
            {isAdmin && (
              <Box
                display='flex'
                flexDirection='column'
                mb={5}
              >
                <Typography
                  fontSize={{ xs: 12, md: 14 }}
                  fontWeight='bold'
                >
                  {membersData?.pending.length} {membersData?.pending.length === 1 ? 'Member Pending' : 'Members Pending'}
                </Typography>
                {membersData?.pending.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    groupId={groupId}
                    profileId={profileId}
                    isPending={true}
                  />
                ))}
              </Box>
            )}
            <Typography
              fontSize={{ xs: 12, md: 14 }}
              fontWeight='bold'
            >
              {membersData?.members.length} {membersData?.members.length === 1 ? 'Member' : 'Members'}
            </Typography>
            {membersData?.members.map((member) => (
              <MemberCard
                key={member.id}
                groupId={groupId}
                profileId={profileId}
                member={member}
              />
            ))}
          </>
        )}
      </Box>
    </Stack>
  );
};

export default GroupMembership;