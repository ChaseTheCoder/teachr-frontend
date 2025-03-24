'use client'

import React, { useCallback, useState } from 'react';
import { Grid } from '@mui/material';
import InfiniteFeed from './feed-infinite';
import Popular from './popular';

export default function Home() {
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleGradesChange = useCallback((grades: string[]) => {
    setSelectedGrades(grades);
  }, []);

  const handleTagsChange = useCallback((tags: string[]) => {
    setSelectedTags(tags);
  }, []);

  return (
    <Grid container spacing={{ xs: 1 , md: 2}}>
      <Grid item xs={12} md={9} order={{ xs: 2, sm: 2, md: 1 }}>
        <InfiniteFeed selectedGrades={selectedGrades} selectedTags={selectedTags} />
      </Grid>
      <Grid item xs={12} md={3} order={{ xs: 1, sm: 1, md: 2 }}>
        <Popular  onGradesChange={handleGradesChange} onTagsChange={handleTagsChange} />
      </Grid>
    </Grid>
  );
}
