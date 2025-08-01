import { Avatar, Box, Typography } from "@mui/material";
import { IGroup } from "../../../types/types";
import Link from "next/link";
import { AdminPanelSettings, Group } from "@mui/icons-material";

export default function GroupCard({ group }: { group: IGroup }) {
  const imageUrl = group.profile_pic_url ? 
  `${group.profile_pic_url}?t=${new Date().getTime()}` : 
  undefined;

  function membershipStatusText(isMember: boolean, isPending: boolean, isAdmin: boolean) {
    if (isAdmin) {
      return 'Admin of this group';
    } else if (isMember) {
      return 'Member of this group';
    } else if (isPending) {
      return 'Pending membership';
    }
  }
  function membershipStatusIcon(isMember: boolean, isPending: boolean, isAdmin: boolean) {
    if (isAdmin) {
      return <AdminPanelSettings color='success' fontSize='small' />
    } else if (isMember) {
      return <Group color='success' fontSize='small' />
    } else if (isPending) {
      return <Group color='warning' fontSize='small' />
    }
  }
  return (
    <Link key={`feed-groups-${group.id}`} href={`/groups/${group.id}`} passHref>
      <Box
        sx={{ 
          paddingX: 2,
          paddingY: 1.5,
          borderRadius: 4,
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          '&:hover': {
            cursor: 'pointer',
            bgcolor: '#fafafa'
          }
        }}
        gap={.5}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Avatar
            sx={{ width: { xs: 30, md: 35 }, height: { xs: 30, md: 35 }, marginRight: '.5rem' }}
            src={imageUrl}
          />
          <Typography sx={{ fontSize: { xs: 16, sm: 18 } }} fontWeight='bold'>{group.title}</Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-start'
          }}
        >
          <Typography sx={{ fontSize: { xs: 12, sm: 14 } }}>{group.about}</Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>
              {group.member_count} members | {group.is_public ? 'Public' : 'Private'}   
            </Typography>
            {membershipStatusIcon(group.is_member, group.is_pending, group.is_admin)}
            <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>
              {membershipStatusText(group.is_member, group.is_pending, group.is_admin)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}