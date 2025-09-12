import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import {
  Card, Stack, Table, TableRow, MenuList, MenuItem,
  TableCell, TableBody, TextField, IconButton, InputAdornment,
  TableContainer
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

const TABLE_HEAD = [
  { id: 'id', label: 'Lead ID' },
  { id: 'name', label: 'Name' },
  { id: 'mobile', label: 'Mobile No' },
  { id: 'actions', label: 'Actions', width: 88 },
];

export function RefferedListView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchReffered = useCallback(
    async (page = table.page, rowsPerPage = table.rowsPerPage, searchTerm = search) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(endpoints.user.refferedleads, {
          params: {
            page: page + 1,
            page_size: rowsPerPage,
            search: searchTerm || ''
          }
        });
        setLeads(response.data.results || []);
        setTotalCount(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching reffered leads:', error);
      } finally {
        setLoading(false);
      }
    },
    [table.page, table.rowsPerPage, search]
  );

  useEffect(() => {
    fetchReffered();
  }, [fetchReffered]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    table.onChangePage(null, 0);
    fetchReffered(0, table.rowsPerPage, value);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Reffered List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Reffered List' },
          { name: 'View' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name or mobile"
            value={search}
            onChange={handleSearch}
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
                    <TableCell colSpan={TABLE_HEAD.length} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <RefferedTableRow key={lead.id} row={lead} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center">
                      No leads found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePaginationCustom
          page={table.page}
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function RefferedTableRow({ row }) {
  const popover = usePopover();
  const confirm = useBoolean();
  const navigate = useNavigate();

  const handleView = () => {
    popover.onClose();
    navigate(paths.dashboard.Allleadview(row.id));
  };
  const handleDelete = () => {
    popover.onClose();
    confirm.onFalse();
    alert(`Deleted lead ${row.name} (ID: ${row.id})`);
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.mobile}</TableCell>
        <TableCell align="right">
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem onClick={handleView}>
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Lead"
        content={`Are you sure you want to delete lead "${row.name}"?`}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
