import Typography from '@mui/material/Typography';
import Header from '../components/header.tsx';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import {
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import {
  getSingleItemContract,
  postNewItemContract,
  updateItemContract,
} from '@3may/contracts';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { withAuth } from '../hocs/withAuth.tsx';
import { useAuth } from '../providers/auth.provider.tsx';
import { Marker } from 'react-leaflet';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import {
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
  useMap,
} from '@vis.gl/react-google-maps';
import Box from '@mui/material/Box';
import PostImageInput from '../components/post-image-input.tsx';
import { getUploadImageUrl, uploadImage } from '../utils/image.ts';
import { UploadInfo } from '../types.ts';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [lat, setLat] = useState('49.825291415855844');
  const [lng, setLng] = useState('24.0117430876972');
  const [itemStatus, setItemStatus] = useState<'lost' | 'found'>('lost');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [markers, setMarkers] = useState<{ [key: string]: typeof Marker }>({});
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [file, setFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clusterer = useRef<MarkerClusterer | null>(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');

  const { token, loading } = useAuth();

  const map = useMap();

  useEffect(() => {
    console.log('getting location');
    navigator.geolocation.getCurrentPosition((position) => {
      if (id) return;
      setLat(String(position.coords.latitude));
      setLng(String(position.coords.longitude));
    });
  }, []);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  console.log(date);

  useEffect(() => {
    if (!id) return;
    const getSinglePost = async () => {
      try {
        const { body } = await getFetchRequest(getSingleItemContract, fetch, {
          baseUrl: import.meta.env.VITE_SWARMION_API_URL,
          pathParameters: {
            itemId: id,
          },
          // @ts-expect-error headers are not defined
          headers: {
            Authorization: token,
          },
        });
        setLng(body.location?.coordinates[0]);
        setLat(body.location?.coordinates[1]);
        setTitle(body.title as string);
        setDescription(body.description as string);
        setDate(body.date?.split('T')[0] as string);
      } catch (error) {
        console.error(error);
      }
    };

    getSinglePost();
  }, []);

  const setPost = async (shouldUpdate: boolean) => {
    setIsSubmitting(true);
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }

      let imageUrl: string | undefined = undefined;

      if (file) {
        const imageUrlData = await getUploadImageUrl(
          file.name || 'image',
          false,
          token,
        );

        if (imageUrlData && !('message' in imageUrlData)) {
          await uploadImage(imageUrlData as UploadInfo, file)
            .then(() => {
              imageUrl = imageUrlData.url as string;
            })
            .catch(() => {
              console.error('There is image uploading error');
              throw new Error('There is image uploading error');
            });
        }
      }

      if (!shouldUpdate) {
        await getFetchRequest(postNewItemContract, fetch, {
          baseUrl: import.meta.env.VITE_SWARMION_API_URL,
          body: {
            title,
            lng: Number(lng),
            lat: Number(lat),
            date,
            description,
            photo: imageUrl,
          },
          pathParameters: {
            status: itemStatus,
          },
          // @ts-expect-error headers are not defined
          headers: {
            Authorization: token,
          },
        });
        navigate('/');
        window.scrollTo(0, 0);
      } else {
        await getFetchRequest(updateItemContract, fetch, {
          baseUrl: import.meta.env.VITE_SWARMION_API_URL,
          body: {
            title,
            lng: Number(lng),
            lat: Number(lat),
            // date,
            description,
            photo: imageUrl,
          },
          pathParameters: {
            itemId: id || "",
          },
          // @ts-expect-error headers are not defined
          headers: {
            Authorization: token,
          },
        });
        navigate('/');
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
      setOpenSnackbar(true);
    }
    setIsSubmitting(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setPost(!!id);
  };

  return (
    <main>
      <Header />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
      />
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '6rem',
          color: 'black',
        }}
      >
        <Typography
          variant={'h2'}
          sx={{
            textAlign: 'center',
            marginTop: '2rem',
          }}
        >
          Create Post
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            width: '100%',
            maxWidth: '700px',
            margin: '0 auto',
            padding: '1rem',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          <TextField
            disabled={isSubmitting}
            type="text"
            variant="outlined"
            color="secondary"
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            fullWidth
            required
          />
          <TextField
            disabled={isSubmitting}
            type="text"
            variant="outlined"
            color="secondary"
            label="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            fullWidth
            rows={4}
            multiline
            required
          />
          <TextField
            disabled={isSubmitting}
            type="date"
            variant="outlined"
            color="secondary"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2}>
            <TextField
              disabled={isSubmitting}
              type={'number'}
              variant="outlined"
              color="secondary"
              label="Latitude"
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              required
              fullWidth
            />
            <TextField
              disabled={isSubmitting}
              type={'number'}
              variant="outlined"
              color="secondary"
              label="Longitude"
              onChange={(e) => setLng(e.target.value)}
              value={lng}
              required
              fullWidth
            />
          </Stack>
          <Map
            style={{
              height: '400px',
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
            disableDefaultUI={isSubmitting}
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
            <AdvancedMarker position={{ lat: +lat, lng: +lng }} />
          </Map>
          <Box
            sx={{
              padding: '1rem 0',
            }}
          >
            <PostImageInput
              isSubmitting={isSubmitting}
              token={token}
              filePath={photoUrl}
              setFilePath={setPhotoUrl}
              file={file}
              setFile={setFile}
            />
          </Box>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Is the thing found or was lost?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              onChange={(e) =>
                setItemStatus(e.target.value as 'lost' | 'found')
              }
              value={itemStatus}
              name="radio-buttons-group"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
              }}
            >
              <FormControlLabel disabled={isSubmitting} value="lost" control={<Radio />} label="Lost" />
              <FormControlLabel
                disabled={isSubmitting}
                value="found"
                control={<Radio />}
                label="Found"
              />
            </RadioGroup>
          </FormControl>
          <Button variant="outlined" disabled={isSubmitting} color="secondary" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </main>
  );
};

export default withAuth(CreatePost);
