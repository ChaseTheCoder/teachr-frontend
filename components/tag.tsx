import { Box, Chip } from '@mui/material';
import React from 'react';
import { IGrade, IGroupList, IGroupPost, ITag } from '../types/types';
import Link from 'next/link';

const gradeToNumber = (grade: string): number => {
  switch (grade.toLowerCase()) {
    case 'prek': return -1;
    case 'k': return 0;
    default: return parseInt(grade.replace(/[^0-9]/g, ''));
  }
};

const numberToGrade = (num: number): string => {
  switch (num) {
    case -1: return 'PreK';
    case 0: return 'K';
    default: return `${num}${num === 2 ? 'nd' : num === 1 ? 'st' : num === 3 ? 'rd' : 'th'}`;
  }
};

const condenseGrades = (grades: IGrade[]): IGrade[] => {
  if (!grades.length) return [];
  
  // Sort grades by their numerical value
  const sortedGrades = [...grades].sort((a, b) => 
    gradeToNumber(a.grade) - gradeToNumber(b.grade)
  );

  const condensedGrades: IGrade[] = [];
  let rangeStart: IGrade | null = null;
  let prevNum: number | null = null;

  for (let i = 0; i < sortedGrades.length; i++) {
    const currentGrade = sortedGrades[i];
    const currentNum = gradeToNumber(currentGrade.grade);
    
    if (prevNum === null || currentNum !== prevNum + 1) {
      // If there was a range in progress, end it
      if (rangeStart) {
        if (prevNum !== gradeToNumber(rangeStart.grade)) {
          condensedGrades.push({
            grade: `${rangeStart.grade}-${numberToGrade(prevNum!)}`,
            id: rangeStart.id
          });
        } else {
          condensedGrades.push(rangeStart);
        }
      }
      rangeStart = currentGrade;
    }
    
    if (i === sortedGrades.length - 1) {
      if (rangeStart && currentNum !== gradeToNumber(rangeStart.grade)) {
        condensedGrades.push({
          grade: `${rangeStart.grade}-${currentGrade.grade}`,
          id: rangeStart.id
        });
      } else {
        condensedGrades.push(currentGrade);
      }
    }
    
    prevNum = currentNum;
  }

  return condensedGrades;
};

interface TagsProps {
  group?: IGroupPost | null;
  grades: IGrade[];
  tags: ITag[];
  post?: boolean;
}

const Tags: React.FC<TagsProps> = ({group, tags, grades}) => {
  const condensedGrades = condenseGrades(grades);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      {group && (
        <Link
          href={`/groups/${group.id}`}
          passHref
          style={{ textDecoration: 'none' }}
          key={group.id}
        >
          <Chip 
            label={group.title} 
            color='success'
            size='small'
          />
        </Link>
      )}
      {condensedGrades.map(grade => (
        <Chip 
          label={grade.grade} 
          key={grade.id} 
          size='small' 
          variant='outlined' 
        />
      ))}
      {tags.length > 0 && tags.map(tag => (
        <Chip 
          label={tag.tag} 
          key={tag.id} 
          size='small' 
          variant='outlined' 
        />
      ))}
    </Box>
  );
};

export default Tags;