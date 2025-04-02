import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteData } from '../../../../services/authenticatedApiCalls';

interface AdminSettingsProps {
  title: string;
  about: string;
  groupId: string;
  profileId: string;
  isPublic: boolean;
  isAdmin: boolean;
  setSectionSelected: (section: string) => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
  title, 
  about, 
  groupId, 
  profileId, 
  isPublic, 
  isAdmin, 
  setSectionSelected
}) => {
  if(!isAdmin) {
    setSectionSelected('activity');
  }

  const router = useRouter();
  const queryClient = useQueryClient();
  const [groupTitle, setGroupTitle] = useState(title);
  const [groupAbout, setGroupAbout] = useState(about);
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteGroupMutation = useMutation({
    mutationFn: async () => {
      setIsDeleting(true);
      try {
        const response = await deleteData(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/delete/${groupId}/?user=${profileId}`
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
      queryClient.invalidateQueries({ queryKey: ['groups', profileId] });
      router.push('/groups');
    },
    onError: (error) => {
      console.error('Error deleting group:', error);
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={2}
    >
      <Box
        display='flex'
        flexDirection='column'
        sx={{
          paddingX: 2,
          paddingY: 1.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          fontSize={{ xs: 12, md: 14 }}
          fontWeight='bold'
          paddingBottom={2}
        >
          Update Group Information
        </Typography>
        <TextField
          label="Group Name"
          variant="outlined"
          value={groupTitle}
          onChange={(e) => setGroupTitle(e.target.value)}
          fullWidth
          size="small"
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="About Group"
          variant="outlined"
          value={groupAbout}
          onChange={(e) => setGroupAbout(e.target.value)}
          fullWidth
          multiline
          rows={4}
          size="small"
          sx={{ marginBottom: 2 }}
        />
      </Box>
      <Box
        display='flex'
        flexDirection='column'
        gap={1}
        sx={{
          paddingX: 2,
          paddingY: 1.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          width: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          fontSize={{ xs: 12, md: 14 }}
          fontWeight='bold'
        >
          Delete Group
        </Typography>
        <Typography
          fontSize={{ xs: 12, md: 14 }}
          color='textSecondary'
        >
          Deleting a group is permanent and cannot be undone. All group content will be lost and all members will be removed.
        </Typography>
        <LoadingButton
          color='error'
          size='small'
          variant='contained'
          sx={{ width: 'fit-content', minWidth: 'auto' }}
          loading={isDeleting}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
              deleteGroupMutation.mutate();
            }
          }}
        >
          Delete Group
        </LoadingButton>
      </Box>
    </Box>
  );
}
export default AdminSettings;