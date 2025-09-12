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

export function EditNatureBusinessView() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Fetch business data by ID
  useEffect(() => {
    const fetchBusinessById = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getNatureBusines(id), {
        });
        setBusinessName(res.data.data.name || '');
      } catch (err) {
        console.error('Error fetching business:', err);
        setError('Failed to fetch business data');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessById(); // ✅ this is correctly scoped
  }, [id]);


  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }
    try {
      await axiosInstance.patch(endpoints.user.editNatureBusiness(id), {
        name: businessName
      },
      );
      setSuccessMsg('Business updated successfully!');
      setTimeout(() => navigate(paths.dashboard.natureBusinesslist), 1500);
    } catch (err) {
      console.error('Error updating business:', err);
      setError('Failed to update business');
      setTimeout(() => setErrorMsg(''), 1500);
      setSuccessMsg('');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Nature Business"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Nature Business' },
          { name: 'Edit' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {!!error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Nature Business Details</Typography>

            <TextField
              label="Business Name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              error={!!error && !successMsg}
              helperText={error && !successMsg ? error : ''}
              fullWidth
              required
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                component={RouterLink}
                href={paths.dashboard.natureBusinesslist}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? 'Loading...' : 'Save Changes'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
