import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import AdvancedFilter from './advanced-filter.tsx';
import { ItemStatus } from '@3may/types';

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
  setItemType?: (val: ItemStatus | undefined) => void;
  setSortBy?: (val: 'date' | 'dist' | undefined) => void;
  setOrder?: (val: 'desc' | 'asc' | undefined) => void;
  itemType?: string;
  sortBy?: string;
  order?: string;
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
  sortBy, setSortBy, itemType, setItemType, setOrder, order
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
        width: '100%',
      }}
    >
      <Box sx={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        width: '100%',
      }}>
        <TextField
          value={query}
          sx={{
            flexGrow: 1,
            display: 'block',
            width: '100%',
            ".MuiInputBase-root": {
              width: "100%"
          }}}
          onChange={(e) => setQuery(e.target.value)}
        />
        <AdvancedFilter
          setLng={setLng}
          setLat={setLat}
          setDistance={setDistance}
          lng={lng}
          lat={lat}
          distance={distance}
          onSubmit={() => handleSubmit()}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setOrder={setOrder}
          order={order}
          itemType={itemType}
          setItemType={setItemType}
        />
      </Box>
    </Box>
  );
};

export default SearchBar;
