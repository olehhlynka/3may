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
import validator from 'validator';

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

export default function SignUp() {
  const [isCredentialsSent, setIsCredentialsSent] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [checkPassword, setCheckPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [login, setLogin] = React.useState('');

  const navigate = useNavigate();

  const validate = (value: string) => {
    if (
      !validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setErrorMessage(`Password is too weak`);
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const signUpHandler = async () => {
    try {
      await getFetchRequest(signUpContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          email,
          password,
          login,
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
          login,
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
    const isPasswordStrong = validate(password);
    if (!isPasswordStrong) {
      return;
    }
    if (password !== checkPassword) {
      setErrorMessage('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }

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
          <img
            src={'/3may-logo.png'}
            alt={'3may'}
            style={{ width: '30%', height: 'auto' }}
          />
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                  id="login"
                  label="Login"
                  name="login"
                  autoComplete="login"
                  onChange={(e) => setLogin(e.target.value)}
                  value={login}
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
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Check Password"
                  type="password"
                  id="checkPassword"
                  onChange={(e) => setCheckPassword(e.target.value)}
                  value={checkPassword}
                />
              </>
            )}
            <Box component={'ul'} sx={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: '0.75rem',
              color: 'gray',
              paddingLeft: '0',
            }}>
              <Typography>Password should contain:</Typography>
              <Typography
                component={'li'}
                sx={{
                  margin: '0.5rem 0',
                  marginLeft: '1.5rem',
                  fontSize: '0.75rem',
                }}
              >
                at least 8 characters
              </Typography>
              <Typography
                component={'li'}
                sx={{
                  margin: '0.5rem 0',
                  marginLeft: '1.5rem',
                  fontSize: '0.75rem',
                }}
              >
                at least 1 number
              </Typography>
              <Typography
                component={'li'}
                sx={{
                  margin: '0.5rem 0',
                  marginLeft: '1.5rem',
                  fontSize: '0.75rem',
                }}
              >
                at least 1 uppercase letter
              </Typography>
              <Typography
                component={'li'}
                sx={{
                  margin: '0.5rem 0',
                  marginLeft: '1.5rem',
                  fontSize: '0.75rem',
                }}
              >
                at least 1 special character
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
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
