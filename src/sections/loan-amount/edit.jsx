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

export function EditLoanAmountView() {
  const [rows, setRows] = useState([{ from: '', to: '' }]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getLoanAmount(id), {
        });
        const data = res.data.data;

        setRows([{ from: data.loan_amount_from, to: data.loan_amount_to }]);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch loan amount range.');
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const emptyRow = rows.find((row) => !row.from || !row.to);
    if (emptyRow) {
      setError('Please fill all "From" and "To" amounts.');
      setSuccessMsg('');
      return;
    }

    const invalidRange = rows.find((row) => Number(row.from) > Number(row.to));
    if (invalidRange) {
      setError('"From Amount" should not be greater than "To Amount".');
      setSuccessMsg('');
      return;
    }
    try {
      const { from, to } = rows[0];

      await axiosInstance.patch(endpoints.user.editLoanAmount(id), {
        loan_amount_from: Number(from),
        loan_amount_to: Number(to),
      });

      setSuccessMsg('Loan amount range updated successfully!');
      setError('');
      setTimeout(() => navigate(paths.dashboard.loanamtlist), 1500);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to update loan amount range.');
      setSuccessMsg('');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Loan Amount Range"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Loan Amount' },
          { name: 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Card sx={{ p: 4 }}>
        <form>
          <Stack spacing={3}>
            <Typography variant="h6">Loan Amount Range</Typography>

            {error && <Alert severity="error">{error}</Alert>}

            {rows.map((row, index) => (
              <Stack direction="row" spacing={2} key={index}>
                <TextField
                  label="From Amount"
                  type="number"
                  value={row.from}
                  onChange={(e) => handleInputChange(index, 'from', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="To Amount"
                  type="number"
                  value={row.to}
                  onChange={(e) => handleInputChange(index, 'to', e.target.value)}
                  fullWidth
                />
              </Stack>
            ))}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                component={RouterLink}
                href={paths.dashboard.loanamtlist}
              >
                Cancel
              </Button>
              <Button variant="contained" onClick={handleUpdate}>
                Update Loan Amount
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
