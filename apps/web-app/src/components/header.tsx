import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

const Header = () => {

  const navItems = [{
    name: 'Home',
    link: '/'
  }, {
    name: 'Create',
    link: '/create-post'
  }, {
    name: 'Contact',
    link: '/contact'
  }];

  return (
    <Box component={"header"} sx={{
      position: 'fixed',
      backgroundColor: 'white',
      width: '100%',
      top: 0,
      left: 0,
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: 0
    }}>
      <Container sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1rem'
      }}>
        <Typography variant="h6" sx={{ my: 2, color: "black" }}>
          3may
        </Typography>
        <Divider />
        <List sx={{
          display: 'flex',
          gap: '1rem',
          padding: 0
        }}>
          {navItems.map(({name, link}) => (
            <ListItem key={name} disablePadding>
              <Link href={link}>
                <ListItemButton sx={{ textAlign: 'center' }}>
                  <ListItemText primary={name} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default Header;