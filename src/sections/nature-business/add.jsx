import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card, Stack, Alert, Button, TextField, Typography
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function AddNatureBusinessView() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Business name is required');
      setSuccessMsg('');
      return;
    }

    try {
      await axiosInstance.post(endpoints.user.addNatureBusiness, { name });

      setName('');
      setError('');
      setSuccessMsg('Nature of Business added successfully!');
      setTimeout(() => navigate(paths.dashboard.natureBusinesslist), 1500);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to add nature of business.');
      setSuccessMsg('');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add Nature Business"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Nature Business' },
          { name: 'Add' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Nature Business Details</Typography>

            <TextField
              label="Business Name"
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
                href={paths.dashboard.natureBusinesslist}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Add Business
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
