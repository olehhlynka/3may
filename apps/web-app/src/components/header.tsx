import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Divider, IconButton, Menu, MenuItem } from '@mui/material';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';

interface IProps {
  username?: string;
}

const Header = ({ username }: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('token');
    navigate('/sign-in');
  }

  const navItems = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Create',
      link: '/create-post',
    },
    {
      name: 'Profile',
      link: '/profile',
    },
    {
      name: 'Log Out',
      onClick: logOut,
    }
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  }

  return (
    <Box
      component={'header'}
      sx={{
        position: 'fixed',
        backgroundColor: '#ffc689',
        width: '100%',
        top: 0,
        left: 0,
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        padding: 0,
      }}
    >
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 1rem',
        }}
      >
        <Typography variant="h6" sx={{ my: 2, color: 'black' }}>
          <Link
            href="/"
            color="inherit"
            underline="none"
            sx={{
              height: '40px',
              width: '40px',
              display: 'flex',
              '& img': {
                height: '100%',
                width: '100%',
                objectFit: 'contain',
                transform: 'scale(1.8)',
              },
            }}
          >
            <img src={'/3may-logo.png'} alt={'3may'} />
          </Link>
        </Typography>
        <Divider />
        <IconButton
          aria-haspopup="true"
          aria-expanded={isMenuOpen ? 'true' : undefined}
          onClick={handleClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
          }}
        >
          <Avatar sx={{ width: 32, height: 32 }} alt={username}></Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={isMenuOpen}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          {navItems.map(({ name, link, onClick }) => {

            if (onClick) {
              return (
                <MenuItem key={name} onClick={onClick}>
                  {name}
                </MenuItem>
              )
            }

            return (
              <Link
                key={name}
                href={link}
                color="inherit"
                style={{
                  textDecoration: 'none',
                }}
              >
                <MenuItem>{name}</MenuItem>
              </Link>
            )
          })}
        </Menu>
      </Container>
    </Box>
  );
};

export default Header;
