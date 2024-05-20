import Grid from '@mui/material/Grid';
import {
  Badge,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from '../components/header.tsx';
import { useEffect, useState } from 'react';
// import { posts } from '../../mock/posts-data.ts';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { getItemsContract, ItemType } from '@3may/contracts';
import { withAuth } from '../hocs/withAuth.tsx';
import { useAuth } from '../providers/auth.provider.tsx';

const MainPage = () => {
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [postItems, setPostItems] = useState<ItemType[]>([]);

  const { token, loading } = useAuth();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocationAllowed(true);
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        console.log(position);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setIsLocationDenied(true);
        } else {
          setIsLocationError(true);
        }
        console.error(error);
      },
    );
  }, []);

  const syncUsers = async () => {
    if (!token) {
      throw new Error('Unauthorized');
    }
    const { body } = await getFetchRequest(getItemsContract, fetch, {
      baseUrl: import.meta.env.VITE_SWARMION_API_URL,
      queryStringParameters: {
        lat: String(lat),
        lng: String(lng),
      },
      // @ts-expect-error headers are not defined
      headers: {
        Authorization: token,
      },
    });

    if ('items' in body) {
      setPostItems(body.items as unknown as ItemType[]);
    }
  };

  useEffect(() => {
    if (isLocationAllowed && !loading) {
      syncUsers();
    }
  }, [isLocationAllowed, loading, token]);

  return (
    <main>
      <Header />
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
        {!isLocationAllowed && !isLocationDenied && (
          <p>Please, allow access to your location to see content here</p>
        )}
        {isLocationDenied && (
          <p>
            Access to your location is denied. You need it to see content here
          </p>
        )}
        {isLocationError && (
          <p>
            There was an error while getting your location. Please, try again
            later
          </p>
        )}
        {isLocationAllowed &&
          postItems.map((post, index) => (
            <Grid
              item
              xs={12}
              md={6}
              key={index + 'post'}
              sx={{ width: '100%' }}
            >
              <CardActionArea component="a" href={`/post/${post._id}`}>
                <Card sx={{ display: 'flex' }}>
                  <CardContent
                    sx={{
                      flex: 1,
                      minWidth: 0,
                      paddingRight: '4rem',
                    }}
                  >
                    {post.status === 'lost' ? (
                      <Chip label="lost" color="error" variant="outlined" />
                    ) : (
                      <Chip label="found" color="primary" variant="outlined" />
                    )}
                    <Typography
                      component="h2"
                      variant="h5"
                      sx={{
                        marginTop: '1rem',
                      }}
                    >
                      {post.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {new Date(post.date as unknown as Date).toDateString()}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      paragraph
                      sx={{
                        // truncate string
                        overflow: 'hidden',
                        width: '100%',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {post.description}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
                    image={`https://source.unsplash.com/random?keys,wallet,phone,glasses,remote,umbrella,hat,gloves,jewelry,pen,book,bottle,card,headphones,document,clothing,charger,flashdrive,toy,controller&index=${index}`}
                    alt={post.title}
                  />
                </Card>
              </CardActionArea>
            </Grid>
          ))}
      </Container>
    </main>
  );
};

// export default MainPage;
export default withAuth(MainPage);
