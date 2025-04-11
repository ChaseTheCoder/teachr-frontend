import { Box, Avatar, Typography } from "@mui/material";
import { IProfileBatch } from "../../../../types/types";
import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import TeacherAvatar from "../../../../components/post/avatar";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postOrPatchData } from "../../../../services/authenticatedApiCalls";
import { useState } from "react";

interface IMemberCard {
  member: IProfileBatch;
  groupId: string;
  profileId: string;
  isPending?: boolean;
}

const MemberCard: React.FC<IMemberCard> = ({ member, groupId, profileId, isPending }) => {
  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [isDisabledAccept, setIsDisabledAccept] = useState(false);
  const [isDisabledReject, setIsDisabledReject] = useState(false);
  const queryClient = useQueryClient();
  
  
  const adminAdmitOrReject = useMutation({
    mutationFn: async (admit: boolean) => {
      if (admit) {
        setIsLoadingAccept(true);
        setIsDisabledReject(true);
      } else {
        setIsLoadingReject(true);
        setIsDisabledAccept(true);
      }
      try {
        const body = {
          pending_user_id: member.id,
          admit: admit
        };
        const response = await postOrPatchData(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/${groupId}/admit/?user=${profileId}`,
          'PATCH',
          body
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
      queryClient.refetchQueries({ queryKey: ['group', 'members', groupId] });
    },
    onError: (error) => {
      console.error('Error leaving group:', error);
    },
    onSettled: () => {
      setIsLoadingAccept(false);
      setIsLoadingReject(false);
      setIsDisabledAccept(false);
      setIsDisabledReject(false);
    }
  });

  return (
    <Box
      key={member.id}
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='space-between'
      gap={1}
    >
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        gap={1}
        sx={{
          paddingY: 1,
          borderRadius: 4,
          bgcolor: '#ffffff',
          width: 'min(100%, 50%)',
          '&:hover': {
        cursor: 'pointer',
        bgcolor: '#fafafa'
          }
        }}
      >
        <Link
          href={`/profile/${member.id}`}
        >
          <Box
            display='flex'
            flexDirection='row'
            alignItems='center'
            width='fit-content'
          >
            <TeacherAvatar
              verified={member.verified}
              profilePicUrl={member.profile_pic_url}
            />
          
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                sx={{ fontSize: { xs: 14, sm: 16 } }}
                fontWeight='bold'
              >
                {member.teacher_name}
              </Typography>
              <Typography
                sx={{ fontSize: { xs: 12, sm: 14 } }}
                color='textSecondary'
              >
                {member.title}
              </Typography>
          </Box>
        </Box>
        </Link>
      </Box>
      { isPending && (
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          gap={{ xs: 2, md: 6 }}
          mr={1}
        >
          <LoadingButton
            color='success'
            startIcon={<PersonAdd />}
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              '& .MuiButton-startIcon': {
              margin: 0,
              },
              textTransform: 'none',
            }}
            onClick={() => {
              adminAdmitOrReject.mutate(true);
            }}
            loading={isLoadingAccept}
            disabled={isDisabledAccept}
          >
            Accept
          </LoadingButton>
          <LoadingButton
            color='error'
            startIcon={<PersonRemove />}
            sx={{
              flexDirection: 'column',
              alignItems: 'center',
              '& .MuiButton-startIcon': {
              margin: 0,
              },
              textTransform: 'none',
            }}
            onClick={() => {
              adminAdmitOrReject.mutate(false);
            }}
            loading={isLoadingReject}
            disabled={isDisabledReject}
          >
            Reject
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
}

export default MemberCard;