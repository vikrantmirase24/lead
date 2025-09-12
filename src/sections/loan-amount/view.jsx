import { useState, useEffect, useCallback } from 'react';

import {
  Card, Stack, Table, Button, TableRow, MenuList, MenuItem, TableCell, TableBody, 
  TextField, IconButton, InputAdornment, TableContainer
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

const TABLE_HEAD = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Loan Amount' },
  { id: 'actions', label: '', width: 88 },
];

export function LoanAmountListView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.user.allLoanAmount, {
        params: {
          page: table.page + 1,
          page_size: table.rowsPerPage,
        },
      });

      setData(res.data.results || []);
      setTotal(res.data.count || 0);
    } catch (err) {
      console.error('Fetch failed:', err);
      setData([]);
      setTotal(0);
    }
    setLoading(false);
  }, [table.page, table.rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Loan Amount"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Loan Amount' },
          { name: 'List' },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ mt: 5 }}
              component={RouterLink}
              variant="contained"
              href={paths.dashboard.loanamtadd}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Loan
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by Loan Amount"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <TableHeadCustom headLabel={TABLE_HEAD} />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data.length > 0 ? (
                  data.map((row) => (
                    <LoanAmountTableRow key={row.id} row={row} onDelete={fetchData} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePaginationCustom
          page={table.page}
          count={total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function LoanAmountTableRow({ row, onDelete }) {
  const popover = usePopover();
  const confirm = useBoolean();

  const range =
    row.loan_amount_from !== null && row.loan_amount_to !== null
      ? `${row.loan_amount_from} - ${row.loan_amount_to}`
      : 'N/A';

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(endpoints.user.deleteLoanAmount(row.id));
      confirm.onFalse();
      popover.onClose();
      onDelete();
    } catch (error) {
      console.error('Failed to delete loan amount:', error);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{range}</TableCell>
        <TableCell align="right">
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem component={RouterLink} to={paths.dashboard.loanamtedit(row.id)}>
            <Iconify icon="solar:pen-bold" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={confirm.onTrue}>
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Loan Amount"
        content="Are you sure you want to delete this loan amount range?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
