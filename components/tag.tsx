import { Box, Chip } from '@mui/material';
import React from 'react';
import { IGrade, ITag } from '../types/types';

interface TagsProps {
  grades: IGrade[];
  tags: ITag[];
  post?: boolean;
}

const Tags: React.FC<TagsProps> = ({tags, grades}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
      {grades.length > 0 &&
        grades.map(grade => {
          return <Chip label={grade.grade} key={grade.id} size='small' variant='outlined' />
        })
      }
      {tags.length > 0 &&
        tags.map(tag => {
          return <Chip label={tag.tag} key={tag.id} size='small' />
        })
      }
    </Box>
  );
};

export default Tags;