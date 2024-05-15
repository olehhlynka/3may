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
import { signUpContract, confirmContract } from '@3may/contracts';
import { useNavigate } from 'react-router-dom';
import { Snackbar } from '@mui/material';

function Copyright(props: TypographyProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" target={"_blank"} href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&themeRefresh=1">
        3may
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignUp() {
  const [isCredentialsSent, setIsCredentialsSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const navigate = useNavigate();

  const signUpHandler = async () => {
    try {
      await getFetchRequest(signUpContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          email,
          password,
        },
      });
      setIsCredentialsSent(true);
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
      setOpenSnackbar(true);
    }
  };

  const confirmHandler = async () => {
    try {
      await getFetchRequest(confirmContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          code: confirmPassword,
          username: email,
        },
      });
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
      setErrorMessage((error as Error).message);
      setOpenSnackbar(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isCredentialsSent) {
      confirmHandler();
    } else {
      signUpHandler();
    }
  };

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
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            {isCredentialsSent ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="code"
                  label="Confirm Code"
                  name="code"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  value={confirmPassword}
                  autoFocus
                />
              </>
            ) : (
              <>
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
              </>
            )}
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
                <Link href="/sign-in" variant="body2">
                  {"Don't have an account? Sign In"}
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
