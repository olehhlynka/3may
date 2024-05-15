import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { validateTokenContract } from '@3may/contracts';
import { useAuth } from '../providers/auth.provider.tsx';
import Box from '@mui/material/Box';

export function withAuth<P extends React.JSX.IntrinsicAttributes = {}>(
  Component: React.FC<P>,
) {
  return (props: P) => {
    const [isLoading, setIsLoading] = React.useState(true);

    const navigate = useNavigate();

    const {
      token,
      loading: tokenLoading,
      isLoggedIn,
      setIsLoggedIn,
    } = useAuth();

    const authUser = async () => {
      try {
        const body = await getFetchRequest(validateTokenContract, fetch, {
          baseUrl: import.meta.env.VITE_SWARMION_API_URL,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (body.statusCode > 400) {
          throw new Error('Token is invalid');
        }

        setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
        console.log('Token is invalid');
        localStorage.removeItem('token');
        navigate('/sign-in');
      }
      setIsLoading(false);
    };

    React.useEffect(() => {
      if (tokenLoading) return;
      if (isLoggedIn) {
        setIsLoading(false);
        return;
      }
      authUser();
    }, [token, tokenLoading]);

    if (isLoading) {
      return (
        <main>
          <Box
            sx={{
              marginTop: '7rem',
              textAlign: 'center',
            }}
          >
            <p>Loading...</p>
          </Box>
        </main>
      );
    }

    return <Component {...props} />;
  };
}
