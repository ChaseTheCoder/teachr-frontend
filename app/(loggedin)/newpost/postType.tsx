import { Avatar, Box, Typography } from "@mui/material";
import { IGroup } from "../../../types/types";

interface PostTypeProps {
  groupData: IGroup | null;
}

export const PostType: React.FC<PostTypeProps> = ({groupData}) => {

  return (
    <Box
      marginBottom={{ xs: 2, md: 3 }}
    >
      <Typography sx={{ fontSize: { xs: 16, sm: 18 } }} fontWeight='bold' component='h1'>
        Create a Post:
      </Typography>
      {groupData && (
        <Box
          display='flex'
          flexDirection='row'
          alignItems='center'
          marginTop={{ xs: 1, md: 2 }}
        >
          <Avatar
            sx={{ width: { xs: 30, md: 35 }, height: { xs: 30, md: 35 }, marginRight: '.5rem' }}
            src={groupData.profile_pic}
          />
          <Box
            display='flex'
            flexDirection='column'
          >
            <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} fontWeight='bold'>
              {groupData.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary'>
              Post will be {groupData.is_public ? 'public as this group is public' : 'private to this group'}
            </Typography>
        </Box>
      </Box>
      )}
    </Box>
  )
}