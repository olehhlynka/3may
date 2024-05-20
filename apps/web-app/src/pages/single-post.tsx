import { useEffect, useState } from 'react';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import {
  getSingleItemContract,
  ItemType,
} from '@3may/contracts';
import { useParams } from 'react-router-dom';
import { useAuth } from '../providers/auth.provider.tsx';
import Header from '../components/header.tsx';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { format } from 'date-fns';
import { Chip, Divider } from '@mui/material';
import Avatar from '@mui/material/Avatar';

interface IProps {
  username?: string;
}

const SinglePost = ({username}: IProps) => {
  const [post, setPost] = useState<ItemType>();

  const { token, loading } = useAuth();
  const [isPostLoading, setIsPostLoading] = useState(true);

  const { id: postId } = useParams();

  useEffect(() => {
    if (!loading) {
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

      fetchPost();
    }
  }, [loading, postId, token]);

  if (isPostLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <Header username={username} />
      <main>
        <Container
          sx={{
            margin: '7rem auto',
            color: 'black',
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
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
                {post.user.email && <b>{post.user.email as unknown as string}</b>}
              </>
            )}
          </Typography>
          <Divider />
          <Box>
            <Typography component="h2" sx={{
              fontSize: '1.5rem',
              marginTop: '2rem',
              marginBottom: '1rem',
              fontWeight: 'bold',
            }}>
              Comment section:
            </Typography>
            {post.comments ? post.comments.map((comment, index) => (
              <Box key={index} sx={{
                padding: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginBottom: '1rem',
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}>
                  <Box sx={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                    <Avatar sx={{ width: 24, height: 24 }} src={comment.user.photoUrl} />
                    <Typography
                      sx={{
                        fontSize: '1.2rem'
                      }}
                    >
                      <b>{comment.user.name}</b>
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontSize: '1rem',
                      color: 'gray',
                    }}
                  >
                    {format(new Date(comment.commentedAt as unknown as string), 'MMMM dd, yyyy')}
                  </Typography>
                </Box>
                <Typography>{comment.text}</Typography>
              </Box>
            )) : (
              <Typography>
                There is no comments yet
              </Typography>
            )}
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default SinglePost;
