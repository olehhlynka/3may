import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, FormControl, Input, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import { MapCircle } from './map-circle.tsx';
import LatLngLiteral = google.maps.LatLngLiteral;
import { ItemStatus } from '@3may/types';

interface IProps {
  setLng: (val: string) => void;
  setLat: (val: string) => void;
  setDistance: (val: string) => void;
  lng: string;
  lat: string;
  distance: string;
  onSubmit: () => void;
  setItemType?: (val: ItemStatus | undefined) => void;
  setSortBy?: (val: 'date' | 'dist' | undefined) => void;
  setOrder?: (val: 'desc' | 'asc' | undefined) => void;
  itemType?: string;
  sortBy?: string;
  order?: string;
}

const AdvancedFilter: React.FC<IProps> = ({
  distance,
  setDistance,
  lng,
  setLng,
  lat,
  setLat,
  onSubmit,
  setOrder, setSortBy, setItemType, itemType, sortBy, order
}) => {
  const [open, setOpen] = React.useState(false);
  const [circleCenter, setCircleCenter] = useState<LatLngLiteral | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onSubmitHandler = () => {
    onSubmit();
    handleClose();
  };

  useEffect(() => {
    setCircleCenter({ lat: +lat, lng: +lng });
  }, [lat, lng]);

  return (
    <div>
      <Button onClick={handleOpen}>Advanced search</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth={'xl'}
      >
        <Box
          sx={{
            margin: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: 'white',
            maxWidth: '700px',
          }}
        >
          <Map
            style={{
              height: '500px',
              width: '500px',
            }}
            mapId={'6515e20e255c704b'}
            defaultZoom={13}
            defaultCenter={{ lat: +lat, lng: +lng }}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log(
                'camera changed:',
                ev.detail.center,
                'zoom:',
                ev.detail.zoom,
              )
            }
            // disableDefaultUI={isSubmitting}
            onClick={(e) => {
              console.log(e);
              if (
                !e.detail.latLng ||
                !e.detail.latLng.lat ||
                !e.detail.latLng.lng
              )
                return;
              setLng('' + e.detail.latLng.lng);
              setLat('' + e.detail.latLng.lat);
            }}
          >
            <MapCircle
              radius={+distance}
              center={circleCenter}
              strokeColor={'#0c4cb3'}
              strokeOpacity={1}
              strokeWeight={3}
              fillColor={'#3b82f6'}
              fillOpacity={0.3}
              clickable={false}
            />
            <AdvancedMarker position={{ lat: +lat, lng: +lng }} />
          </Map>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '1rem',
              margin: 'auto',
              color: 'black',
            }}
          >
            <Box>
              <Typography>Latitude: </Typography>
              <Input
                type="number"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </Box>
            <Box>
              <Typography>Longitude: </Typography>
              <Input
                type="number"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </Box>
            <Box>
              <Typography>Distance: </Typography>
              <Input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </Box>
          </Box>
          <Box sx={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            width: '100%',
          }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-by"
                id="sort-by"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy?.(e.target.value as 'date' | 'dist' | undefined)}
              >
                <MenuItem value={undefined}>None</MenuItem>
                <MenuItem value={"date"}>Date</MenuItem>
                <MenuItem value={"dist"}>Distance</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Order</InputLabel>
              <Select
                labelId="order"
                id="order"
                value={order}
                label="Order"
                onChange={(e) => setOrder?.(e.target.value as 'desc' | 'asc' | undefined)}
              >
                <MenuItem value={undefined}>None</MenuItem>
                <MenuItem value={"desc"}>Descending</MenuItem>
                <MenuItem value={"asc"}>Ascending</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Item Type</InputLabel>
              <Select
                labelId="item-type"
                id="item-type"
                value={itemType}
                label="Item Type"
                onChange={(e) => setItemType?.(e.target.value as ItemStatus | undefined)}
              >
                <MenuItem value={undefined}>None</MenuItem>
                <MenuItem value={"lost"}>Lost</MenuItem>
                <MenuItem value={"found"}>Found</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button type={'button'} onClick={() => onSubmitHandler()}>
            Search
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default AdvancedFilter;
