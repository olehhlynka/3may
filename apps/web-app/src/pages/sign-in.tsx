import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { signInContract } from '@3may/contracts';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';
import { useEffect } from 'react';
import { useAuth } from '../providers/auth.provider.tsx';

function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link
        color="inherit"
        target={'_blank'}
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&themeRefresh=1"
      >
        3may
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [signedIn, setSignedIn] = React.useState(false);

  const navigate = useNavigate();

  const { setIsLoggedIn } = useAuth();

  const signIn = async () => {
    try {
      const { body, statusCode } = await getFetchRequest(
        signInContract,
        fetch,
        {
          baseUrl: import.meta.env.VITE_SWARMION_API_URL,
          body: {
            username: email,
            password,
          },
        },
      );
      if (statusCode > 400) {
        throw new Error('Invalid credentials');
      }
      localStorage.setItem('token', body.token);
      setIsLoggedIn(true);
      setSignedIn(true);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signIn();
  };

  useEffect(() => {
    if (!signedIn) return;
    navigate('/');
  }, [signedIn]);

  return (
    <main>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={errorMessage}
      />
    </main>
  );
}
