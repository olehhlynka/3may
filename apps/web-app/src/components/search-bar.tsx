import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import AdvancedFilter from './advanced-filter.tsx';

interface IProps {
  onSubmit: () => void;
  query: string;
  setQuery: (query: string) => void;
  setLng: (val: string) => void;
  setLat: (val: string) => void;
  setDistance: (val: string) => void;
  lng: string;
  lat: string;
  distance: string;
}

const SearchBar: React.FC<IProps> = ({
  onSubmit,
  setQuery,
  query,
  distance,
  setDistance,
  lng,
  setLng,
  lat,
  setLat,
}) => {
  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    onSubmit();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'center',
      }}
    >
      <Box sx={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
      }}>
        <TextField
          value={query}
          sx={{
            flexGrow: 1,
            display: 'block',
          }}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </Box>
      <AdvancedFilter
        setLng={setLng}
        setLat={setLat}
        setDistance={setDistance}
        lng={lng}
        lat={lat}
        distance={distance}
        onSubmit={() => handleSubmit()}
      />
    </Box>
  );
};

export default SearchBar;
