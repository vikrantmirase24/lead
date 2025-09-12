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
  { id: 'name', label: 'Document Name' },
  { id: 'actions', label: '', width: 88 },
];

export function PropertyDocumentListView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [searchText, setSearchText] = useState('');
  const [documents, setDocuments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async (page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoints.user.allPropertyDocument, {
        params: { page, page_size: pageSize },
      });

      const docArray = response.data.results || [];
      const count = response.data.count || 0;

      setDocuments(docArray);
      setTotalCount(count);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const searchDocuments = async (search, page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(endpoints.user.searchPropertyDocument, {
        params: { search, page, page_size: pageSize },
      });

      const docArray = response.data.results || [];
      const count = response.data.count || 0;

      setDocuments(docArray);
      setTotalCount(count);
    } catch (error) {
      console.error('Search failed:', error);
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentPage = table.page + 1;
    const pageSize = table.rowsPerPage;

    if (searchText.trim()) {
      searchDocuments(searchText, currentPage, pageSize);
    } else {
      fetchDocuments(currentPage, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, table.page, table.rowsPerPage]);

  const refreshData = () => {
    const currentPage = table.page + 1;
    const pageSize = table.rowsPerPage;

    if (searchText.trim()) {
      searchDocuments(searchText, currentPage, pageSize);
    } else {
      fetchDocuments(currentPage, pageSize);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Property Document List"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Property Document' },
          { name: 'List' },
        ]}
        action={
          <Stack direction="row" spacing={2}>
            <Button
              sx={{ mt: 5 }}
              component={RouterLink}
              variant="contained"
              href={paths.dashboard.propetyDocumentadd}
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Document
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by Document name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                refreshData();
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
                ) : documents.length > 0 ? (
                  documents.map((row) => (
                    <PropertyDocumentTableRow
                      key={row.id}
                      row={row}
                      onDeleteSuccess={refreshData}
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
          count={totalCount}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function PropertyDocumentTableRow({ row, onDeleteSuccess }) {
  const popover = usePopover();
  const confirm = useBoolean();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(endpoints.user.deletepropertydocument(row.id));
      confirm.onFalse();
      popover.onClose();
      onDeleteSuccess();
    } catch (error) {
      console.error('Failed to delete document:', error);
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
          <MenuItem component={RouterLink} to={paths.dashboard.propetyDocumentedit(row.id)}>
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
        title="Delete Document"
        content="Are you sure you want to delete this Property Document?"
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
