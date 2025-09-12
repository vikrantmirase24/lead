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

export function AddProductView() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const token = sessionStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Name is required');
      setSuccessMsg('');
      return;
    }
    setError('');
    setSuccessMsg('');

    try {
      await axiosInstance.post(endpoints.user.addProduct, { name });

      setName('');
      setSuccessMsg('Product added successfully!');
      setTimeout(() => navigate(paths.dashboard.productlist), 1500);
    } catch (err) {
      setError('Error adding product');
      setSuccessMsg('');
    }
  };

  return (
    <DashboardContent>

      <CustomBreadcrumbs
        heading="Add Product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product' },
          { name: 'Add' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />
      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
       {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Product Details</Typography>
            <TextField
              label="Name"
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
                href={paths.dashboard.productlist}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Add Product
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}