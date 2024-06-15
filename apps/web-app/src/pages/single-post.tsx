import { useEffect, useState } from 'react';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import {
  getSingleItemContract,
  getUserContract,
  ItemType,
  UserType,
} from '@3may/contracts';
import { useParams } from 'react-router-dom';
import { useAuth } from '../providers/auth.provider.tsx';
import Header from '../components/header.tsx';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { Chip, Divider } from '@mui/material';
import CommentForm from '../components/comment-form.tsx';
import Link from '@mui/material/Link';
import { AdvancedMarker, Map } from '@vis.gl/react-google-maps';
import Comment from '../components/comment.tsx';
import { withAuth } from '../hocs/withAuth.tsx';
import { EditAttributes, EditOutlined, EditSharp } from '@mui/icons-material';

interface IProps {
  username?: string;
}

const SinglePost = ({ username }: IProps) => {
  const [post, setPost] = useState<ItemType>();
  const [user, setUser] = useState<UserType | null>(null);

  const { token, loading } = useAuth();
  const [isPostLoading, setIsPostLoading] = useState(true);

  const { id: postId } = useParams();

  const fetchPost = async () => {
    try {
      if (!token) {
        throw new Error('Unauthorized');
      }
      if (!postId) {
        throw new Error('No post id');
      }
      const { body } = await getFetchRequest(getSingleItemContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        pathParameters: {
          itemId: postId,
        },
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });
      console.log(body);
      if (!('message' in body)) {
        setPost(body);
      }
    } catch (error) {
      console.error(error);
    }
    setIsPostLoading(false);
  };

  const getUser = async () => {
    try {
      const { body } = await getFetchRequest(getUserContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });

      if (!('message' in body)) {
        setUser(body);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!loading && token) {
      getUser();
    }
  }, [token, loading]);

  useEffect(() => {
    if (!loading) {
      fetchPost();
    }
  }, [loading, postId, token]);

  const refreshPost = () => {
    fetchPost();
  };

  if (isPostLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <Header avatarUrl={user?.photoUrl} username={username} />
      <main>
        <Container
          sx={{
            margin: '7rem auto',
            color: 'black',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography
              component={'h1'}
              sx={{
                fontSize: '1.7rem',
                marginBottom: '1rem',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {post?.title}
            </Typography>
            {post.user?._id === user?._id && (
              <Link href={`/create-post?id=${post._id}`} sx={{
                border: '1px solid blue',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'blue',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <EditOutlined /> Edit
              </Link>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <Typography>
              {format(new Date(post.date as unknown as Date), 'MMMM dd, yyyy')}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.5rem',
              }}
            >
              {post.status === 'lost' ? (
                <Chip label="lost" color="error" variant="outlined" />
              ) : (
                <Chip label="found" color="info" variant="filled" />
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              padding: '1.5rem 0',
              position: 'relative',
              '& img': {
                width: '100%',
                height: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
              },
            }}
          >
            <img src={post.photo} alt={post.title} />
          </Box>
          <Typography
            sx={{
              fontSize: '1.2rem',
              marginBottom: '1rem',
            }}
          >
            {post.description}
          </Typography>
          <Typography
            sx={{
              fontSize: '1.2rem',
              margin: '1rem 0',
            }}
          >
            {post.user && (
              <>
                <i>Author: </i>
                {post.user.name && (
                  <b>
                    {(post.user.name as unknown as string) ||
                      (post.user.email as unknown as string)}
                  </b>
                )}
              </>
            )}
          </Typography>
          <Divider />
          <Typography
            sx={{
              margin: '1.5rem 0',
              fontSize: '1.5rem',
              fontWeight: 'bold',
            }}
          >
            Location:
          </Typography>
          <Map
            style={{
              height: '400px',
              marginBottom: '1.5rem',
            }}
            mapId={'6515e20e255c704b'}
            defaultZoom={15}
            defaultCenter={{
              lat: +post.location.coordinates[1],
              lng: +post.location.coordinates[0],
            }}
          >
            <AdvancedMarker
              position={{
                lat: +post.location.coordinates[1],
                lng: +post.location.coordinates[0],
              }}
            />
          </Map>
          <Divider />
          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: '1.5rem',
                marginTop: '2rem',
                marginBottom: '1rem',
                fontWeight: 'bold',
              }}
            >
              Comment section:
            </Typography>
            {post.comments ? (
              <>
                {post.comments.map((comment, index) => (
                  <Comment
                    canBeEdited={
                      user?._id.toString() === comment.user._id.toString()
                    }
                    canBeDeleted={
                      user?._id.toString() === comment.user._id.toString() ||
                      user?._id.toString() === post.user._id.toString()
                    }
                    refreshPost={refreshPost}
                    itemId={post._id.toString()}
                    token={token}
                    id={comment._id.toString()}
                    text={comment.text}
                    photoUrl={comment.user.photoUrl as string}
                    username={comment.user.username as string}
                    createdAt={comment.createdAt as unknown as string}
                    key={index}
                  />
                ))}
              </>
            ) : (
              <Typography>There is no comments yet</Typography>
            )}
            <Box
              sx={{
                padding: '1rem',
                marginTop: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}
            >
              {postId && (
                <CommentForm
                  onSubmit={fetchPost}
                  token={token}
                  postId={postId}
                />
              )}
            </Box>
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default withAuth<IProps>(SinglePost);
