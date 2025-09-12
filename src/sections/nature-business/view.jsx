import { useState, useEffect } from 'react';

import {
  Card, Stack, Table, Button, TableRow, MenuList, MenuItem, TableCell, TableBody, 
  TextField, IconButton, InputAdornment, TableContainer, CircularProgress
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
  { id: 'name', label: 'Business Name' },
  { id: 'actions', label: '', width: 88 },
];

export function NatureBusinessView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [searchText, setSearchText] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.user.allNatureBusiness);
      const businessArray = Array.isArray(res.data)
        ? res.data
        : res.data.data || [];
      setBusinesses(businessArray);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  // Search function with pagination
  const searchBusinesses = async (search, page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.user.searchNatureBusiness, {
        params: {
          search,
          page,
          page_size: pageSize,
        },
      });
      const businessArray = Array.isArray(res.data)
        ? res.data
        : res.data.results || res.data.data || [];
      setBusinesses(businessArray);
    } catch (error) {
      console.error('Search failed:', error);
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim()) {
      searchBusinesses(searchText, table.page + 1, table.rowsPerPage);
    } else {
      fetchBusinesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, table.page, table.rowsPerPage]);

  const filteredList = Array.isArray(businesses)
    ? businesses.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Business List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Business' },
          { name: 'List' }
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ mt: 5 }}
              component={RouterLink}
              variant="contained"
              href={paths.dashboard.natureBusinessadd}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Business
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by Business name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchText.trim()) {
                  searchBusinesses(searchText, table.page + 1, table.rowsPerPage);
                } else {
                  fetchBusinesses();
                }
              }
            }}
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
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : filteredList.length > 0 ? (
                  filteredList
                    .slice(table.page * table.rowsPerPage, (table.page + 1) * table.rowsPerPage)
                    .map((row) => (
                      <BusinessTableRow
                        key={row.id}
                        row={row}
                        onDeleteSuccess={fetchBusinesses}
                      />
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center">
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePaginationCustom
          page={table.page}
          count={filteredList.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function BusinessTableRow({ row, onDeleteSuccess }) {
  const popover = usePopover();
  const confirm = useBoolean();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(endpoints.user.deleteNatureBusiness(row.id));
      confirm.onFalse();
      popover.onClose();
      onDeleteSuccess();
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell align="right">
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem component={RouterLink} to={paths.dashboard.natureBusinessedit(row.id)}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={confirm.onTrue}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Business"
        content="Are you sure you want to delete this Business?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}