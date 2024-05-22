import Grid from '@mui/material/Grid';
import {
  Badge,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Pagination,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Header from '../components/header.tsx';
import { useEffect, useState } from 'react';
// import { posts } from '../../mock/posts-data.ts';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import {
  getItemsContract,
  ItemType,
  searchItemsContract,
} from '@3may/contracts';
import { withAuth } from '../hocs/withAuth.tsx';
import { useAuth } from '../providers/auth.provider.tsx';
import Box from '@mui/material/Box';
import SearchBar from '../components/search-bar.tsx';

const MainPage = () => {
  const PAGE_LIMIT = 10;

  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [postItems, setPostItems] = useState<ItemType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState('');

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

  const syncUsers = async (page: number) => {
    if (!token) {
      throw new Error('Unauthorized');
    }
    try {
      if (!query) {
        const { body } = await getFetchRequest(getItemsContract, fetch, {
          baseUrl: import.meta.env.VITE_SWARMION_API_URL,
          queryStringParameters: {
            lat: String(lat),
            lng: String(lng),
            page: String(page),
            limit: String(PAGE_LIMIT),
          },
          // @ts-expect-error headers are not defined
          headers: {
            Authorization: token,
          },
        });

        if ('items' in body) {
          setPostItems(body.items as unknown as ItemType[]);
          setTotalPages(body.total as unknown as number);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const searchPosts = async () => {
    try {
      const { body } = await getFetchRequest(searchItemsContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        queryStringParameters: {
          lat: String(lat),
          lng: String(lng),
          description: query,
          sortBy: "date",
          order: "desc"
        },
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });

      if ('items' in body) {
        setPostItems(body.items as unknown as ItemType[]);
        setTotalPages(body.total as unknown as number);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchSubmit = () => {
    searchPosts()
  }

  useEffect(() => {
    if (isLocationAllowed && !loading) {
      syncUsers(page);
    }
  }, [isLocationAllowed, loading, token, page]);

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
        {isLocationAllowed && (
          <>
            <Box sx={{
              padding: "1rem",
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <SearchBar query={query} onSubmit={onSearchSubmit} setQuery={setQuery} />
            </Box>
            {postItems.map((post, index) => (
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
                        <Chip
                          label="found"
                          color="primary"
                          variant="outlined"
                        />
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
          </>
        )}
        <Box
          sx={{
            padding: '1rem 0 2rem',
          }}
        >
          {totalPages !== 0 && (
            <Pagination
              // get pages count from totalCount (items count) and limit
              count={Math.ceil(totalPages / PAGE_LIMIT)}
              page={page}
              onChange={(_, page) => setPage(page)}
            />
          )}
        </Box>
      </Container>
    </main>
  );
};

// export default MainPage;
export default withAuth(MainPage);
