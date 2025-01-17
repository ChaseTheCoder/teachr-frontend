import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      router.push(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <TextField
      placeholder='Search...'
      id='search-bar'
      hiddenLabel
      variant='filled'
      size='small'
      color='success'
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyPress={handleKeyPress}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        disableUnderline: true,
      }}
      sx={{
        width: '100%',
        maxWidth: '600px',
        '& .MuiFilledInput-root': {
          borderRadius: '25px',
        },
      }}
    />
  );
}