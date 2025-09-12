import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Card, Stack, Alert, Button, TextField, Typography
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function EditPropertyView() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyById = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getProperty(id), {
        });
        setName(res.data.data.name || '');
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyById();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Property name is required');
      return;
    }
    try {
      await axiosInstance.patch(endpoints.user.editProperty(id), {
        name
      },);

      setSuccessMsg('Property updated successfully!');
      setTimeout(() => {
        navigate(paths.dashboard.propertylist);
      }, 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError('Failed to update property');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Property"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Property' },
          { name: 'Edit' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {!!successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Property Details</Typography>
            <TextField
              label="Property Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!error}
              helperText={error}
              fullWidth
              required
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                component={RouterLink}
                href={paths.dashboard.propertylist}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
