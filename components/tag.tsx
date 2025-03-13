import { Box, Chip } from '@mui/material';
import React from 'react';
import { ITag } from '../types/types';

interface TagsProps {
  tags: ITag[];
  post?: boolean;
}

const Tags: React.FC<TagsProps> = ({tags}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      {tags.length > 0 &&
        tags.map(tag => {
          return <Chip label={tag.tag} key={tag.id} size='small' />
        })
      }
    </Box>
  );
};

export default Tags;