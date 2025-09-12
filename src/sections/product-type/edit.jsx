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

export function EditProductView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getProduct(id), {
        });
        const data = res.data.data;
        setFormData({
          name: data.name || '',
        });
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductById();
  }, [id]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    try {
      await axiosInstance.patch(endpoints.user.editProduct(id), {
        name: formData.name,
      }, );
      setSuccessMsg('Product updated successfully!');
      setTimeout(() => {
        navigate(paths.dashboard.productlist);
      }, 1500);
    } catch (err) {
      console.error('Failed to update product:', err);
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
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product' },
          { name: 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {!!successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
      {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Typography variant="h6">Product Details</Typography>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              fullWidth
              required
              error={!!error}
              helperText={error}
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
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
