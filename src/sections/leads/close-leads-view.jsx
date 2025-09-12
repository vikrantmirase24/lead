import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  Card, Stack, Table, TableRow, MenuList, MenuItem,
  TableCell, TableBody, TextField, IconButton, InputAdornment, TableContainer,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextareaAutosize, Alert
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

const TABLE_HEAD = [
  { id: 'id', label: 'Lead ID' },
  { id: 'name', label: 'Name' },
  { id: 'mobile', label: 'Mobile No' },
  { id: 'actions', label: 'Actions', width: 120 },
];

export function ClosedLeadsListView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  // Reopen modal state
  const [openReopen, setOpenReopen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const fetchClosedLeads = useCallback(
    async (page = table.page, rowsPerPage = table.rowsPerPage, searchTerm = search) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(endpoints.user.closeleads, {
          params: { page: page + 1, page_size: rowsPerPage, search: searchTerm || '' }
        });
        setLeads(response.data.results.data || []);
        setTotalCount(response.data.count || 0);
      } catch (error) {
        console.error('Error fetching closed leads:', error);
      } finally { setLoading(false); }
    },
    [table.page, table.rowsPerPage, search]
  );

  useEffect(() => { fetchClosedLeads(); }, [fetchClosedLeads]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    table.onChangePage(null, 0);
    fetchClosedLeads(0, table.rowsPerPage, value);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Closed Leads"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Closed Leads' },
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
                    <TableCell colSpan={TABLE_HEAD.length} align="center">Loading...</TableCell>
                  </TableRow>
                ) : leads.length > 0 ? (
                  leads.map((lead) => (
                    <ClosedLeadTableRow
                      key={lead.id}
                      row={lead}
                      onReopen={() => { setSelectedLead(lead); setOpenReopen(true); }}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={TABLE_HEAD.length} align="center">No closed leads found.</TableCell>
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

      <ReopenModal
        open={openReopen}
        onClose={() => setOpenReopen(false)}
        lead={selectedLead}
        refreshList={fetchClosedLeads}
      />
    </DashboardContent>
  );
}

function ClosedLeadTableRow({ row, onReopen }) {
  const popover = usePopover();
  const navigate = useNavigate();

  const handleView = () => { popover.onClose(); navigate(paths.dashboard.Allleadview(row.id)); };

  return (
    <>
      <TableRow hover>
        <TableCell>{row.id}</TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.mobile_number}</TableCell>
        <TableCell align="right">
          <IconButton onClick={popover.onOpen}><Iconify icon="eva:more-vertical-fill" /></IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover open={popover.open} anchorEl={popover.anchorEl} onClose={popover.onClose}>
        <MenuList>
          <MenuItem onClick={handleView}><Iconify icon="solar:eye-bold" /> View</MenuItem>
          <MenuItem onClick={() => { popover.onClose(); onReopen(); }}>
            <Iconify icon="solar:refresh-bold" /> Reopen
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

// Reopen modal
function ReopenModal({ open, onClose, lead, refreshList }) {
  const [remark, setRemark] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const resetForm = () => setRemark('');

  const handleSave = async () => {
    if (!lead) return;
    try {
      setSaving(true);
      await axiosInstance.post(endpoints.user.reopenLead(lead.id), {
        reopen: true,
        remark
      });
      setSuccessMsg('Lead reopened successfully');
      setTimeout(() => {
        setSuccessMsg('');
        resetForm();
        onClose();
        refreshList();
      }, 1500);
    } catch (error) {
      setErrorMsg('Failed to reopen lead');
      setTimeout(() => setErrorMsg(''), 2000);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Reopen Lead</DialogTitle>
      <DialogContent>
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <TextField
          label="Remarks"
          fullWidth
          multiline
          minRows={3}
          placeholder="Enter your remarks"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}