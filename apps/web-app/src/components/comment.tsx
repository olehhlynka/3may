import React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { deleteCommentContract, editCommentContract } from '@3may/contracts';
import Button from '@mui/material/Button';
import { Delete, EditNote } from '@mui/icons-material';

interface IProps {
  photoUrl: string;
  username: string;
  createdAt: string;
  text: string;
  id: string;
  itemId: string;
  token: string | null;
  canBeEdited: boolean;
  canBeDeleted: boolean;
  refreshPost: () => void;
}

const Comment: React.FC<IProps> = ({
  id,
  text,
  username,
  photoUrl,
  createdAt,
  token,
  itemId,
  canBeEdited,
                                     canBeDeleted,
  refreshPost
}) => {
  const [newText, setNewText] = React.useState(text);
  const [isEditing, setIsEditing] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await getFetchRequest(editCommentContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          text: newText,
        },
        pathParameters: {
          commentId: id,
          itemId,
        },
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });
    } catch (error) {
      console.error(error);
      setNewText(text);
    }

    setIsEditing(false);
  };

  const deleteComment = async () => {
    try {
      await getFetchRequest(deleteCommentContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        pathParameters: {
          commentId: id,
          itemId,
        },
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        },
      });

      refreshPost();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box
      sx={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        marginBottom: '1rem',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ width: 24, height: 24 }} src={photoUrl} />
          <Typography
            sx={{
              fontSize: '1.2rem',
            }}
          >
            <b>{username}</b>
          </Typography>
          {canBeEdited && (
            <Button
              sx={{
                width: '20px',
                height: '20px',
                padding: '0',
                minWidth: '0',
              }}
              onClick={() => setIsEditing(!isEditing)}
            >
              <EditNote />
            </Button>
          )}
          {canBeDeleted && (
            <Button
              sx={{
                width: '20px',
                height: '20px',
                padding: '0',
                minWidth: '0',
              }}
              type={"button"}
              variant={"text"}
              color={"error"}
              onClick={() => deleteComment()}
            >
              <Delete />
            </Button>
          )}
        </Box>
        <Typography
          sx={{
            fontSize: '1rem',
            color: 'gray',
          }}
        >
          {format(new Date(createdAt as unknown as string), 'MMMM dd, yyyy')}
        </Typography>
      </Box>
      {isEditing ? (
        <form onSubmit={onSubmit}>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            style={{
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100px',
              marginBottom: '1rem',
              background: 'transparent',
              color: 'black',
              padding: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
          <Button type="submit">Save</Button>
        </form>
      ) : (
        <Typography>{newText}</Typography>
      )}
    </Box>
  );
};

export default Comment;
