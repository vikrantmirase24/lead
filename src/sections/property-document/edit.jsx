import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Card, Stack, Alert, Button, TextField, Typography, CircularProgress
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function EditPropertyDocumentView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [docName, setDocName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getPropertyDocument(id));
        setDocName(res.data.data.name || '');
      } catch (err) {
        setError('Error fetching property document');
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docName.trim()) {
      setError('Document name is required');
      return;
    }

    try {
      await axiosInstance.patch(endpoints.user.propertydocumentedit(id), {
        name: docName
      },);

      setSuccessMsg('Property document updated successfully!');
      setTimeout(() => {
        navigate(paths.dashboard.propetyDocumentlist);
      }, 1500);
    } catch (err) {
      console.error('Failed to update document:', err);

      if (err.response) {
        console.error('Server responded with error:', err.response.data);
        setError(err.response.data?.message || 'Server error occurred');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response received. Check network or CORS settings.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(`Unexpected error: ${err.message}`);
      }

      setSuccessMsg('');
    }
  };

  if (loading) {
    return (
      <DashboardContent>
        <CircularProgress />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Property Document"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Property Document' },
          { name: 'Edit' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
       {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Property Document Details</Typography>
            <TextField
              label="Document Name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              error={!!error}
              helperText={error}
              fullWidth
              required
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                component={RouterLink}
                href={paths.dashboard.propetyDocumentlist}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Update Document
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
