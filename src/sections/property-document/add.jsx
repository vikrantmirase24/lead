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

export function AddPropertyDocumentView() {
  const navigate = useNavigate();
  const [docName, setDocName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!docName.trim()) {
      setError('Document name is required');
      setSuccessMsg('');
      return;
    }

    try {
      setError('');
      setSuccessMsg('');

      await axiosInstance.post(endpoints.user.addPropertyDocument, {
        name: docName.trim()
      });

      setDocName('');
      setSuccessMsg('Property document added successfully!');
      setTimeout(() => navigate(paths.dashboard.propetyDocumentlist), 1500);
    } catch (err) {
      console.error(err);
      setError('Failed to add property document.');
      setSuccessMsg('');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add Property Document"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Property Document' },
          { name: 'Add' }
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
                Add Document
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}