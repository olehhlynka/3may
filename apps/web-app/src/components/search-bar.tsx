import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

interface IProps {
  onSubmit: () => void;
  query: string;
  setQuery: (query: string) => void;
}

const SearchBar: React.FC<IProps> = ({ onSubmit, setQuery, query }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    }}>
      <TextField value={query} sx={{
        flexGrow: 1,
        display: "block"
      }} onChange={(e) => setQuery(e.target.value)} />
      <Button type="submit">
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
