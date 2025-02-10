import { Box, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';


interface CommentCountProps {
  comments: number;
}

const CommentCount: React.FC<CommentCountProps> = ({ comments }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} gap={.5}>
      <ChatBubbleOutlineIcon color='disabled' fontSize='small' aria-label='comments icon' />
      <Typography sx={{ fontSize: { xs: 12, sm: 14 } }} color='textSecondary' aria-label={`${comments} comments`}>{comments}</Typography>
    </Box>
  )
}

export default CommentCount;