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
  { id: 'name', label: 'Property Name' },
  { id: 'actions', label: '', width: 88 },
];

export function PropertyListView() {
  const table = useTable({ defaultRowsPerPage: 5 });

  const [searchText, setSearchText] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.user.allProperty);
      const propertyArray = Array.isArray(res.data)
        ? res.data
        : res.data.results || res.data.data || [];
      setProperties(propertyArray);
    } catch (error) {
      console.error('Error fetching property list:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async (term, page = 1, pageSize = table.rowsPerPage) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(endpoints.user.searchProperty,
        {
          params: {
            search: term,
            page,
            page_size: pageSize,
          },
        });
      const propertyArray = Array.isArray(res.data)
        ? res.data
        : res.data.results || res.data.data || [];
      setProperties(propertyArray);
    } catch (error) {
      console.error('Search failed:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim()) {
      searchProperties(searchText, table.page + 1, table.rowsPerPage);
    } else {
      fetchProperties();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, table.page, table.rowsPerPage]);

  const filteredList = Array.isArray(properties)
    ? properties.filter((item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase())
    )
    : [];

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Property List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Property' },
          { name: 'List' }
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ mt: 5 }}
              component={RouterLink}
              variant="contained"
              href={paths.dashboard.propertyadd}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Property
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by Property name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (searchText.trim()) {
                  searchProperties(searchText, table.page + 1, table.rowsPerPage);
                } else {
                  fetchProperties();
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

        {loading ? (
          <Stack alignItems="center" py={5}>
            <CircularProgress />
          </Stack>
        ) : (
          <>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <TableHeadCustom headLabel={TABLE_HEAD} />
                  <TableBody>
                    {filteredList.length > 0 ? (
                      filteredList
                        .slice(table.page * table.rowsPerPage, (table.page + 1) * table.rowsPerPage)
                        .map((row) => (
                          <PropertyTableRow key={row.id} row={row} onDelete={fetchProperties} />
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
          </>
        )}
      </Card>
    </DashboardContent>
  );
}

function PropertyTableRow({ row, onDelete }) {
  const popover = usePopover();
  const confirm = useBoolean();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(endpoints.user.deleteProperty(row.id));
      confirm.onFalse();
      popover.onClose();
      onDelete(); // Refresh list
    } catch (error) {
      console.error('Failed to delete property:', error);
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
          <MenuItem component={RouterLink} to={paths.dashboard.propertyedit(row.id)}>
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
        title="Delete Property"
        content="Are you sure you want to delete this Property?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}