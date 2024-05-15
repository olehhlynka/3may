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
import { useState } from 'react';
import Button from '@mui/material/Button';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { postNewItemContract } from '@3may/contracts';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useNavigate } from 'react-router-dom';
import { withAuth } from '../hocs/withAuth.tsx';
import { useAuth } from '../providers/auth.provider.tsx';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [itemStatus, setItemStatus] = useState<'lost' | 'found'>('lost');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const { token, loading } = useAuth();

  const setPost = async () => {
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      await getFetchRequest(postNewItemContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          title,
          lng: Number(lng),
          lat: Number(lat),
          date,
          description,
        },
        pathParameters: {
          status: itemStatus,
        },
        headers: {
          Authorization: token,
        },
      });
      navigate('/')
      window.scrollTo(0, 0)
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setPost();
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
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">
              Is the thing found or was lost?
            </FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              onChange={(e) => setItemStatus(e.target.value as any)}
              value={itemStatus}
              name="radio-buttons-group"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
              }}
            >
              <FormControlLabel value="lost" control={<Radio />} label="Lost" />
              <FormControlLabel
                value="found"
                control={<Radio />}
                label="Found"
              />
            </RadioGroup>
          </FormControl>
          <Button variant="outlined" color="secondary" type="submit">
            Register
          </Button>
        </form>
      </Container>
    </main>
  );
};

export default withAuth(CreatePost);
