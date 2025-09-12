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

export function AddLoanAmountView() {
  const [rows, setRows] = useState([{ from: '', to: '' }]);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleAddRow = () => {
    const last = rows[rows.length - 1];
    const from = Number(last.from);
    const to = Number(last.to);

    if (!last.from || !last.to) {
      setError('Please fill both From and To amounts before adding a new row.');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    if (from > to) {
      setError('"From Amount" should not be greater than "To Amount".');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }

    setError('');
    setRows([...rows, { from: '', to: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emptyRow = rows.find(row => !row.from || !row.to);
    if (emptyRow) {
      setError('Please fill all "From" and "To" amounts.');
      setSuccessMsg('');
      return;
    }
    const invalidRange = rows.find(row => Number(row.from) > Number(row.to));
    if (invalidRange) {
      setError('"From Amount" should not be greater than "To Amount".');
      setSuccessMsg('');
      return;
    }
    try {
      await rows.reduce(
        (promiseChain, row) =>
          promiseChain.then(() =>
            axiosInstance.post(endpoints.user.addLoanAmount, {
              loan_amount_from: Number(row.from),
              loan_amount_to: Number(row.to)
            })
          ),
        Promise.resolve()
      );
      setRows([{ from: '', to: '' }]);
      setError('');
      setSuccessMsg('Loan Amount Range(s) added successfully!');
      setTimeout(() => navigate(paths.dashboard.loanamtlist), 1500);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to add loan amount range(s).');
      setSuccessMsg('');
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Add Loan Amount Range"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Loan Amount' },
          { name: 'Add' }
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Card sx={{ p: 4, mt: 2 }}>
        <form onSubmit={handleSubmit}>
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
              <Button variant="outlined" onClick={handleAddRow}>
                + Add New Row
              </Button>
              <Button
                variant="outlined"
                component={RouterLink}
                href={paths.dashboard.loanamtlist}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Add Loan Amount
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>
    </DashboardContent>
  );
}
