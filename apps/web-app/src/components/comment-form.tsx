import React, { useState } from 'react';
import { getFetchRequest } from '@swarmion/serverless-contracts';
import { addNewCommentContract } from '@3may/contracts';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface IProps {
  onSubmit: () => void;
  postId: string;
  token: string | null;
}

const CommentForm: React.FC<IProps> = ({ onSubmit, postId, token }) => {
  const [commentText, setCommentText] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText) return;
    try {
      await getFetchRequest(addNewCommentContract, fetch, {
        baseUrl: import.meta.env.VITE_SWARMION_API_URL,
        body: {
          text: commentText,
        },
        pathParameters: {
          itemId: postId,
        },
        // @ts-expect-error headers are not defined
        headers: {
          Authorization: token,
        }
      });
      onSubmit();
      setCommentText("")
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        multiline
        rows={4}
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        sx={{
          width: "100%"
        }}
      />
      <Box sx={{
        padding: "1rem 0 0 0 "
      }}>
        <Button variant="outlined" type={"submit"}>
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default CommentForm;
