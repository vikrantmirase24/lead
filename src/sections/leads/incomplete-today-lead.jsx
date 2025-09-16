import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Stack, Table, TableRow, MenuList, MenuItem,
  TableCell, TableBody, TextField, IconButton, InputAdornment,
  TableContainer, CircularProgress
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

import axiosInstance, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Lead ID' },
  { id: 'name', label: 'Name' },
  { id: 'mobile', label: 'Mobile No' },
  { id: 'actions', label: 'Actions', width: 120 },
];

// ----------------------------------------------------------------------

export default function TodayLeadsIncomplete() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [search, setSearch] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchLeads = async (page = 1, pageSize = table.rowsPerPage, searchText = '') => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoints.user.incompleteTodayLead, {
        params: {
          page,
          page_size: pageSize,
          search: searchText || undefined, 
        },
      });

      const data = response.data;
      setLeads(data?.results || []);
      setTotalCount(data?.total_count || 0);
    } catch (error) {
      console.error('Error fetching today’s incomplete leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(table.page + 1, table.rowsPerPage, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.page, table.rowsPerPage]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    table.onChangePage(null, 0); 
    fetchLeads(1, table.rowsPerPage, value);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Incomplete Today Leads"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Incomplete Today Leads' },
          { name: 'View' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card sx={{ mt: 2 }}>
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
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <IncompleteTodayLeadTableRow key={lead.id} row={lead} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center">
                      No Incomplete Leads found.
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

// ----------------------------------------------------------------------

function IncompleteTodayLeadTableRow({ row }) {
  const popover = usePopover();
  const navigate = useNavigate();

  const handleEdit = () => {
    popover.onClose();
    navigate(paths.dashboard.incompleteTodayLeadEdit(row.id));
  };

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.mobile_number}</TableCell>
        <TableCell align="right">
          <IconButton onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem onClick={handleEdit}>
            <Iconify icon="solar:pen-bold" /> Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
