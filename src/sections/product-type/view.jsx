import { useState, useEffect } from 'react';

import {
  Card, Stack, Table, Button, TableRow, MenuList, MenuItem, TableCell,
  TableBody, TextField, IconButton, InputAdornment, TableContainer, CircularProgress
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
  { id: 'name', label: 'Product Name' },
  { id: 'actions', label: '', width: 88 },
];

export function ProductListView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // ✅ Single API handler (works for both search & normal fetch)
  const fetchProducts = async (search = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      let response;
      if (search.trim()) {
        response = await axiosInstance.get(endpoints.user.searchProduct, {
          params: { search, page, page_size: pageSize },
        });
      } else {
        response = await axiosInstance.get(endpoints.user.allProduct, {
          params: { page, page_size: pageSize },
        });
      }

      const productArray = Array.isArray(response.data)
        ? response.data
        : response.data.results || response.data.data || [];

      setProducts(productArray);
      setTotalCount(response.data.count || productArray.length);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Effect for page, rowsPerPage, and search
  useEffect(() => {
    fetchProducts(searchText, table.page + 1, table.rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, table.page, table.rowsPerPage]);

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Product List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Product' },
          { name: 'List' },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ mt: 5 }}
              component={RouterLink}
              variant="contained"
              href={paths.dashboard.productadd}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Product
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        {/* 🔎 Search */}
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by Product name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* 📋 Table */}
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
                ) : products.length > 0 ? (
                  products.map((row) => (
                    <ProductTableRow key={row.id} row={row} onDeleteSuccess={() =>
                      fetchProducts(searchText, table.page + 1, table.rowsPerPage)
                    } />
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

        {/* 📌 Pagination (uses API count) */}
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

function ProductTableRow({ row, onDeleteSuccess }) {
  const popover = usePopover();
  const confirm = useBoolean();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(endpoints.user.deleteProduct(row.id));
      confirm.onFalse();
      popover.onClose();
      onDeleteSuccess(); // refresh list after delete
    } catch (error) {
      console.error('Failed to delete product:', error);
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
          <MenuItem component={RouterLink} to={paths.dashboard.productedit(row.id)}>
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
        title="Delete Product"
        content="Are you sure you want to delete this Product?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
