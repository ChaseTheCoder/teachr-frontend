import { Avatar, Box, Typography } from "@mui/material";
import JoinGroup from "../joinGroup";
import { IGroupDetail } from "../../../../types/types";

interface GroupInformationProps {
  groupData: IGroupDetail;
  profileId: string;
}

const GroupInformation: React.FC<GroupInformationProps> = ({groupData, profileId}) => {
  // Add timestamp to image URL to force reload
  const imageUrl = groupData.profile_pic_url ? 
    `${groupData.profile_pic_url}?t=${new Date().getTime()}` : 
    undefined;

  return (
    <Box
      sx={{ 
        paddingX: 2,
        paddingY: 1.5,
        borderRadius: 4,
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
      gap={1}
    >
      <Box display='inline-flex'>
        <Avatar
          alt="Profile Image"
          sx={{ width: { xs: 75, md: 100 }, height: { xs: 75, md: 100 }, marginRight: '.5rem' }}
          src={imageUrl}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant='h1'
          fontWeight='bold'
          color='textPrimary'
          sx={{ fontSize: { xs: 24, sm: 32 } }}
        >
          {groupData.title}
        </Typography>
        <Typography
          sx={{ fontSize: { xs: 12, sm: 14 } }}
          color='textSecondary'
        >
          {groupData.is_public ? 'Public' : 'Private'} group
        </Typography>
        <Typography
          sx={{ fontSize: { xs: 12, sm: 14 } }}
          color='textSecondary'
        >
          {groupData.member_count} members
        </Typography>
        <JoinGroup
          isPublic={groupData.is_public}
          isMember={groupData.is_member}
          isPending={groupData.is_pending}
          isAdmin={groupData.is_admin}
          groupId={groupData.id}
          profileId={profileId}
        />
      </Box>
    </Box>
  );
}

export default GroupInformation;