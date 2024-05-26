import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Dialog, Input } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import { MapCircle } from './map-circle.tsx';
import LatLngLiteral = google.maps.LatLngLiteral;

interface IProps {
  setLng: (val: string) => void;
  setLat: (val: string) => void;
  setDistance: (val: string) => void;
  lng: string;
  lat: string;
  distance: string;
  onSubmit: () => void;
}

const AdvancedFilter: React.FC<IProps> = ({
  distance,
  setDistance,
  lng,
  setLng,
  lat,
  setLat,
  onSubmit,
}) => {
  const [open, setOpen] = React.useState(false);
  const [circleCenter, setCircleCenter] = useState<LatLngLiteral | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
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
          <Button type={'button'} onClick={() => onSubmitHandler()}>
            Search
          </Button>
        </Box>
      </Dialog>
    </div>
  );
};

export default AdvancedFilter;
