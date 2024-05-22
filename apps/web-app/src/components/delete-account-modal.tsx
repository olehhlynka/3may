import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { deleteUserContract } from '@3may/contracts';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface IProps {
  token: string | null;
}

function DeleteAccountModal(props: IProps) {
  const [open, setOpen] = useState(false);
  // const { onClose, selectedValue, open } = props;

  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAccount = async () => {
    if (!props.token) {
      throw new Error('Unauthorized');
    }

    try {
      await getFetchRequest(deleteUserContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: props.token,
        },
      });
      setOpen(false);
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete your account?</p>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '1rem',
            alignItems: 'center',
          }}>
            <Button onClick={() => setOpen(false)} variant={"outlined"} color={"info"} sx={{
              width: '49%',
            }}>Cancel</Button>
            <Button onClick={deleteAccount} variant={"contained"} color={"error"} sx={{
              width: '49%',
            }}>Delete Account</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <Box
        sx={{
          display: 'flex',
          marginTop: '2rem',
        }}
      >
        <Button onClick={() => setOpen(true)} variant="outlined" color="error">
          Delete Account
        </Button>
      </Box>
    </>
  );
}

export default DeleteAccountModal;
