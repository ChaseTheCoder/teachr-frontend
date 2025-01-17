import { Box, Skeleton } from "@mui/material"

export const ActivityLoading: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={80} />
    </Box>
  )
}

export const ActivityLoadingMultiSize: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }} gap={1}>
      <Skeleton variant='rounded' height={80} />
      <Skeleton variant='rounded' height={120} />
      <Skeleton variant='rounded' height={100} />
      <Skeleton variant='rounded' height={100} />
      <Skeleton variant='rounded' height={90} />
      <Skeleton variant='rounded' height={100} />
    </Box>
  )
}