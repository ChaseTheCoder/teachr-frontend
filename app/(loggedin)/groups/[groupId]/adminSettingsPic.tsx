import React, { useEffect } from 'react'
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Button, Stack } from '@mui/material';
import { postProfilePic } from '../../../../services/authenticatedApiCalls';

interface ProfilePicProps {
  groupId: string;
  profileId: string;
}

export default function UploadProfilePicGroups({ groupId, profileId }: ProfilePicProps) {
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
      
      // Add file validation
      if (!file.type.startsWith('image/')) {
        console.error('File must be an image');
        return;
      }
  
      // Add size validation (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        console.error('File is too large');
        return;
      }
  
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const mutationPatch = useMutation({
    mutationFn: async () => {
      if (!selectedFile) {
        throw new Error('No file selected');
      }
  
      const formData = new FormData();
      formData.append('profile_pic', selectedFile);
      
      try {
        const result = await postProfilePic(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/group/${groupId}/image/?user_id=${profileId}`,
          formData
        );
        return result;
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      await queryClient.invalidateQueries({ queryKey: ['groups'] });
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    },
    onError: (error) => {
      console.error('Error uploading group image:', error);
    },
    onSettled: () => {
      setSelectedFile(null);
    }
  });

  return (
    <Stack gap={2}>
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
        Upload Pic
      </Button>
    </Stack>
  );
}