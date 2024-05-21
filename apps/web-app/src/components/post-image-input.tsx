import React from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface IProps {
  filePath: string;
  setFilePath: (val: string) => void;
  token: string | null;
  file: File | null;
  setFile: (val: File | null) => void;
}

const PostImageInput: React.FC<IProps> = ({ setFile, file }) => {


  const setFileImageHandler = React.useCallback((file: File) => {
    try {
      const url = URL.createObjectURL(file);
      const img = new Image();

      img.src = url;

      setFile(file);
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

  const { getInputProps, getRootProps } = useDropzone({
    onDrop: imageDropHandler,
    accept: {
      'image/jpeg': ['.jpg'],
      'image/png': ['.png'],
    },
    multiple: false,
  });

  const imageReset = React.useCallback(() => {
    setFile(null);
  }, []);

  return (
    <>
      {file ? (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem',
          border: '1px solid #ccc',
          borderRadius: '5px',
          marginBottom: '1rem',
        }}>
          <div>
            <Typography sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: "black",
              marginBottom: '0.5rem',
            }}>{file?.name}</Typography>
            <Typography sx={{
              fontSize: '0.8rem',
              color: "gray",
            }}>
              {Math.round(file?.size * 0.001 * 10) / 10} KB
            </Typography>
          </div>
          <Button
            onClick={imageReset}
            variant="outlined"
            color={"error"}
          >
            Remove
          </Button>
        </Box>
      ) : (
        <Box {...getRootProps()} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          border: '1px dashed #ccc',
          borderRadius: '5px',
          marginBottom: '1rem',
          color: "gray",
          cursor: "pointer",
        }}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop an image here, or click to select a file</p>
        </Box>
      )}
    </>
  );
};

export default PostImageInput;
