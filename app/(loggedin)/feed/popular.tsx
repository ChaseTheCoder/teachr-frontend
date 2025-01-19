import React from 'react';
import { Box, Typography } from '@mui/material';
import Surface from '../../../components/surface/Surface';
import { AutoAwesome } from '@mui/icons-material';

const Popular: React.FC = () => {
  return (
    <Surface>
      <Box display="flex" flexDirection="column" gap={.5}>
        <Box display="flex" flexDirection="row" gap={1}>
          <AutoAwesome color='success' fontSize='small' />
          <Typography fontSize={18}>Teachr Lounge AI</Typography>
        </Box>
        <Typography fontSize={16}>What Are Teachers Talking About?</Typography>
        <Typography fontSize={14} lineHeight={1.2} color='#424242'>
          Teachers on the platform are actively discussing a variety of practical challenges and sharing strategies to improve their classrooms. Popular topics include behavior management techniques for challenging classrooms, effective literacy activities, and ways to support English Language Learners. There&apos;s a strong focus on addressing current curriculum concerns, such as transitioning away from outdated resources like Lucy Calkins&apos; Units of Study and understanding the role of F&P testing. Teachers are also looking for creative lesson ideas, like engaging students in topics such as microplastics, and seeking support for tasks like creating newsletters for parents and report card comments. Classroom distractions, such as cell phones, and administrative challenges, like student behavior policies, are also frequently discussed, reflecting a broader concern with fostering effective and supportive learning environments. The most popular trends emphasize practical, actionable advice that can be implemented quickly to address these common issues.
        </Typography>
      </Box>
    </Surface>
  );
};

export default Popular;