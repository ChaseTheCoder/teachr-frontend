'use client'

import React, { useState } from 'react';
import { Typography, Box, Container, Skeleton, TextField } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, postOrPatchData } from '../../../services/authenticatedApiCalls';
import { format } from 'date-fns';
import { LoadingButton } from '@mui/lab';
import Editor from '../../../components/editor';
import Surface from '../../../components/surface/Surface';
import { useUserContext } from '../../../context/UserContext';
import { Add as AddIcon } from '@mui/icons-material';
import { Fab } from '@mui/material';

interface NewPolicyData {
  type: string;
  content: string;
  url_path_name: string;
}

interface PolicyAdminData {
  id: string;
  type: string;
  content: string;
  last_updated: string;
  created_at: string;
  url_path_name: string;
}

export default function PolicyAdmin() {
  const { auth0Id } = useUserContext();
  const queryClient = useQueryClient();
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  const [editedType, setEditedType] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newPolicy, setNewPolicy] = useState<NewPolicyData>({
    type: '',
    content: '',
    url_path_name: ''
  });

  const { data: policyAdminData, isLoading } = useQuery<PolicyAdminData[]>({
    queryKey: ['policies', 'admin'],
    queryFn: () => getData(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/policies/admin-view/${auth0Id}/`
    ),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const mutationUpdate = useMutation({
    mutationFn: async (policyId: string) => {
      return await postOrPatchData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/policies/${policyId}/admin-view/${
          auth0Id}/`,
        'PATCH',
        {
          type: editedType,
          content: editedContent,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policiesList'] });
      queryClient.invalidateQueries({ queryKey: ['policies', 'admin'] });
      queryClient.invalidateQueries({ queryKey: ['policy'], exact: false });
      setEditingPolicy(null);
    },
  });

  const mutationCreate = useMutation({
    mutationFn: async (data: NewPolicyData) => {
      return await postOrPatchData(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/policies/admin-view/${auth0Id}/`,
        'POST',
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policiesList'] });
      queryClient.invalidateQueries({ queryKey: ['policies', 'admin'] });
      setIsCreating(false);
      setNewPolicy({ type: '', content: '', url_path_name: '' });
    },
  });

  const handleEdit = (policy: PolicyAdminData) => {
    setEditingPolicy(policy.id);
    setEditedType(policy.type);
    setEditedContent(policy.content);
  };

  const handleCancel = () => {
    setEditingPolicy(null);
    setEditedType('');
    setEditedContent('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutationCreate.mutate(newPolicy);
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton variant="text" sx={{ fontSize: '2.5rem', mb: 2 }} />
        <Skeleton variant="text" sx={{ fontSize: '0.875rem', mb: 4 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Existing Policies List */}
      {policyAdminData?.map((policy) => (
        <Surface key={policy.id}>
          {editingPolicy === policy.id ? (
            <Box component="form" onSubmit={(e) => {
              e.preventDefault();
              mutationUpdate.mutate(policy.id);
            }}>
              <TextField
                fullWidth
                label="Policy Title"
                value={editedType}
                onChange={(e) => setEditedType(e.target.value)}
                color="success"
                sx={{ mb: 2 }}
              />
              <Editor
                onChange={(data) => setEditedContent(data)}
                value={editedContent}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="success"
                  loading={mutationUpdate.isPending}
                >
                  Save Changes
                </LoadingButton>
                <LoadingButton
                  variant="outlined"
                  color="success"
                  onClick={handleCancel}
                >
                  Cancel
                </LoadingButton>
              </Box>
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h1" 
                  component="h1"
                  sx={{ 
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    fontWeight: 'bold',
                  }}
                >
                  {policy.type}
                </Typography>
                <LoadingButton
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleEdit(policy)}
                >
                  Edit
                </LoadingButton>
              </Box>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mb: 4 }}
              >
                Last updated: {format(new Date(policy.last_updated), 'MMMM d, yyyy')}
              </Typography>
              <Box 
                sx={{ 
                  '& > *': { mb: 2 },
                  '& h2': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    mt: 4,
                    mb: 2
                  },
                  '& p': {
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  },
                  '& ul, & ol': {
                    pl: 3,
                    mb: 2
                  },
                  '& li': {
                    mb: 1
                  }
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: policy.content }} />
              </Box>
            </>
          )}
        </Surface>
      ))}

      {/* Add New Policy Section */}
      {isCreating ? (
        <Surface>
          <Box component="form" onSubmit={handleCreateSubmit}>
            <Typography 
              variant="h1" 
              component="h1"
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Create New Policy
            </Typography>
            <TextField
              fullWidth
              label="Policy Title"
              value={newPolicy.type}
              onChange={(e) => setNewPolicy(prev => ({ ...prev, type: e.target.value }))}
              color="success"
              sx={{ mb: 2 }}
              required
            />
            <TextField
              fullWidth
              label="URL Path Name"
              value={newPolicy.url_path_name}
              onChange={(e) => setNewPolicy(prev => ({ ...prev, url_path_name: e.target.value }))}
              color="success"
              sx={{ mb: 2 }}
              required
              helperText="This will be used in the URL (e.g., 'privacy-policy')"
            />
            <Editor
              onChange={(data) => setNewPolicy(prev => ({ ...prev, content: data }))}
              value={newPolicy.content}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="success"
                loading={mutationCreate.isPending}
              >
                Create Policy
              </LoadingButton>
              <LoadingButton
                variant="outlined"
                color="success"
                onClick={() => {
                  setIsCreating(false);
                  setNewPolicy({ type: '', content: '', url_path_name: '' });
                }}
              >
                Cancel
              </LoadingButton>
            </Box>
          </Box>
        </Surface>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <LoadingButton
            variant="contained"
            color="success"
            onClick={() => setIsCreating(true)}
            startIcon={<AddIcon />}
          >
            Create New Policy
          </LoadingButton>
        </Box>
      )}
    </Container>
  );
}