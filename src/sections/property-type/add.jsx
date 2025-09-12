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

export function AddPropertyView() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMsg('Property name is required');
      setSuccessMsg('');
      setTimeout(() => setErrorMsg(''), 1500);
      return;
    }

    try {
      await axiosInstance.post(endpoints.user.addProperty, { name });

      setSuccessMsg('Property added successfully!');
      setErrorMsg('');
      setName('');

      setTimeout(() => {
        setSuccessMsg('');
        navigate(paths.dashboard.propertylist);
      }, 1500);

    } catch (err) {
      console.error('Error adding property:', err);
      setErrorMsg('Failed to add property. Please try again.');
      setSuccessMsg('');
      setTimeout(() => setErrorMsg(''), 1500);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add Property"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Property' },
          { name: 'Add' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Property Details</Typography>

            <TextField
              label="Property Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errorMsg}
              helperText={errorMsg}
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
                Add Property
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
