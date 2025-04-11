import React, { useEffect } from 'react'
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Stack, Typography } from '@mui/material';

interface ProfilePicProps {
  profileId: string;
}

export default function UploadProfilePic({ profileId }: ProfilePicProps) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Clean up the URL when component unmounts or when selected file changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      // Create a URL for the preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const mutationPatch = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('profile_pic', selectedFile);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/profile/${profileId}/image/`, {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Error posting profile:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    },
    onError: (error) => {
      console.error('Error posting profile:', error);
    },
    onSettled: () => {
      setSelectedFile(null);
      queryClient.refetchQueries({ queryKey: ['profile']});
    }
  });

  return (
    <Stack gap={2}>
      <Typography variant='h2' fontWeight='bold' sx={{ fontSize: '22px'}}>Upload new profile picture</Typography>
      <Avatar 
        src={previewUrl || undefined}
        sx={{ width: 100, height: 100 }} // Optional: make avatar bigger for better preview
      />
      <input type="file" onChange={handleFileChange} />
      <Button 
        onClick={() => mutationPatch.mutate()} 
        disabled={!selectedFile} 
        color="success" 
        size="small"
        variant="contained"
        sx={{ width: 'fit-content' }}
      >
        Upload
      </Button>
    </Stack>
  );

  // class MyEditor extends React.Component {
  //   render() {
  //     return (
  //       <AvatarEditor
  //         image="https://teachr-backend.onrender.com/media/profile_pics/2d770e04-bd9d-4def-9b5d-feec263cb570.png"
  //         width={250}
  //         height={250}
  //         border={50}
  //         color={[255, 255, 255, 0.6]} // RGBA
  //         scale={1.2}
  //         rotate={0}
  //       />
  //     )
  //   }
  // }
}