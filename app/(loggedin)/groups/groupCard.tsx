import { Avatar, Box, Typography } from "@mui/material";
import { IGroup } from "../../../types/types";
import Link from "next/link";

export default function GroupCard({ group }: { group: IGroup }) {
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
            src={undefined}
          />
          <Typography sx={{ fontSize: { xs: 16, sm: 18 } }} fontWeight='bold'>{group.title}</Typography>
        </Box>
        <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary'>{group.about}</Typography>
        <Typography sx={{ fontSize: { xs: 10, sm: 12 } }} color='textSecondary'>{group.member_count} members | {group.is_public ? 'Public' : 'Private'}</Typography>

      </Box>
    </Link>
  );
}