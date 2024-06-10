import Header from '../components/header.tsx';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { getUserContract, updateUserContract, UserType } from '@3may/contracts';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../providers/auth.provider.tsx';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { withAuth } from '../hocs/withAuth.tsx';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useDropzone } from 'react-dropzone';
import { getUploadImageUrl, uploadImage } from '../utils/image.ts';
import { UploadInfo } from '../types.ts';
import { Checkbox } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import DeleteAccountModal from '../components/delete-account-modal.tsx';

const ProfilePage = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [file, setFile] = React.useState<File | null>(null);
  const [areNotificationsEnabled, setAreNotificationsEnabled] =
    React.useState(false);

  const { token, loading } = useAuth();

  const setFileImageHandler = React.useCallback((file: File) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.src = url;

      setFile(file);

      console.log(file);
    } catch (e) {
      console.error('There is image loading error');
    }
  }, []);

  const imageDropHandler = React.useCallback(
    (acceptedFiles: Array<File>) => {
      setFileImageHandler(acceptedFiles[0]);
    },
    [setFileImageHandler],
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    onDrop: imageDropHandler,
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
    },
    multiple: false,
  });

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
        setName(body.username);
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

  const profileImageUrl = React.useMemo(() => {
    if (!file) return undefined;

    return URL.createObjectURL(file);
  }, [file]);

  const updateUser = async () => {
    if (!token) {
      throw new Error('Unauthorized');
    }

    let imageUrl: string | undefined = undefined;

    try {
      if (file && profileImageUrl) {
        const imageUrlData = await getUploadImageUrl(
          file.name || 'image',
          false,
          token,
        );

        console.log(imageUrlData);

        if (imageUrlData && !('message' in imageUrlData)) {
          await uploadImage(imageUrlData as UploadInfo, file)
            .then(() => {
              imageUrl = imageUrlData.url as string;
            })
            .catch(() => {
              console.error('There is image uploading error');
              throw new Error('There is image uploading error');
            });
        }
      }

      await getFetchRequest(updateUserContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          name,
          photo: imageUrl,
        },
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });

      setIsEditing(false);
      getUser();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header avatarUrl={user?.photoUrl} />
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6rem',
            marginBottom: '2rem',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'black',
              fontSize: '2rem',
              fontWeight: 'bold',
            }}
          >
            Profile
          </Typography>
          <Button
            onClick={isEditing ? () => updateUser() : () => setIsEditing(true)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Box>
        <Box
          sx={{
            border: '1px dashed gray',
            padding: '1.5rem',
            borderRadius: '2rem',
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: 'black',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Profile Image
            </Typography>
            <Box
              sx={{
                paddingBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Avatar
                sx={{
                  height: '120px',
                  width: '120px',
                }}
                // src={profileImageUrl || (user?.photo as string)}
                src={
                  isEditing
                    ? profileImageUrl || (user?.photoUrl as string)
                    : (user?.photoUrl as string)
                }
                alt={String(user?.name)}
              />
              {isEditing && (
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button type="button" onClick={open}>
                    Change Image
                  </Button>
                </div>
              )}
            </Box>
          </Box>
          <Box>
            <Typography
              variant="h2"
              sx={{
                color: 'black',
                fontSize: '1rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
              }}
            >
              Name
            </Typography>
            {isEditing ? (
              <Box>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            ) : (
              <Typography
                sx={{
                  color: 'black',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                }}
              >
                {user?.username}
              </Typography>
            )}
          </Box>
          {isEditing && (
            <FormControlLabel
              sx={{
                color: 'black',
                padding: '1rem 0',
                display: 'flex',
                alignItems: 'center',
              }}
              control={
                <Checkbox
                  checked={areNotificationsEnabled}
                  onChange={(val) =>
                    setAreNotificationsEnabled(val.target.checked)
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Allow Notifications"
            />
          )}
          <DeleteAccountModal token={token} />
        </Box>
      </Container>
    </div>
  );
};

export default withAuth(ProfilePage);
