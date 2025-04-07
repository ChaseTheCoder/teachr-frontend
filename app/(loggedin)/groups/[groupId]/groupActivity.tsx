import { Typography } from "@mui/material";

interface GroupActivityProps {
  isPublic: boolean;
  isMember: boolean;
}
const GroupActivity: React.FC<GroupActivityProps> = ({isPublic, isMember}) => {
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

  return (
    <div>
      <Typography
        fontSize={{xs: 24, md: 36}}
        color='textSecondary'
      >
        Group Activity
      </Typography>
    </div>
  );
}

export default GroupActivity;