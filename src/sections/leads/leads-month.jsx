import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import {
  Card, Stack, Table, TableRow, MenuList, MenuItem,
  TableCell, TableBody, TextField, IconButton, InputAdornment,
  TableContainer, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Select, FormControl, InputLabel, Alert, MenuItem as MuiMenuItem,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance, { endpoints } from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'id', label: 'Lead ID' },
  { id: 'name', label: 'Name' },
  { id: 'mobile', label: 'Mobile No' },
  { id: 'actions', label: 'Actions', width: 88 },
];

export function MonthLeadsListView() {
  const table = useTable({ defaultRowsPerPage: 5 });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  // Modal state
  const [openFollowUp, setOpenFollowUp] = useState(false);
  const [openReferred, setOpenReferred] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Fetch leads
  const fetchMonthLeads = useCallback(async (page = table.page, rowsPerPage = table.rowsPerPage, searchTerm = search) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(endpoints.user.monthleads, {
        params: {
          page: page + 1,
          page_size: rowsPerPage,
          search: searchTerm || ''
        }
      });

      const results = Array.isArray(response.data)
        ? response.data
        : response.data.results?.data || [];

      setLeads(results);
      setTotalCount(response.data.count || results.length);
    } catch (error) {
      console.error('Error fetching month leads:', error);
    } finally {
      setLoading(false);
    }
  }, [table.page, table.rowsPerPage, search]);

  useEffect(() => {
    fetchMonthLeads();
  }, [fetchMonthLeads]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    table.onChangePage(null, 0);
    fetchMonthLeads(0, table.rowsPerPage, value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Month Leads"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Month Leads' },
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
                      <MonthLeadTableRow
                        key={lead.id}
                        row={lead}
                        onFollowUp={() => {setSelectedLead(lead); setOpenFollowUp(true); }}
                        onReferred={() => {setSelectedLead(lead); setOpenReferred(true); }}
                      />
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

        {/* Modals */}
        <FollowUpModal open={openFollowUp} onClose={() => setOpenFollowUp(false)} lead={selectedLead} />
        <ReferredModal open={openReferred} onClose={() => setOpenReferred(false)} lead={selectedLead} />
      </DashboardContent>
    </LocalizationProvider>
  );
}

// Table Row Component
function MonthLeadTableRow({ row, onFollowUp, onReferred }) {
  const popover = usePopover();
  const navigate = useNavigate();

  const handleView = () => {
    popover.onClose();
    navigate(paths.dashboard.Allleadview(row.id));
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
          <MenuItem onClick={handleView}>
            <Iconify icon="solar:eye-bold" /> View
          </MenuItem>
          <MenuItem onClick={() => { popover.onClose(); onFollowUp(); }}>
            <Iconify icon="solar:calendar-bold" /> FollowUp
          </MenuItem>
          <MenuItem onClick={() => { popover.onClose(); onReferred(); }}>
            <Iconify icon="solar:user-plus-bold" /> Referred
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}

// FollowUp Modal
function FollowUpModal({ open, onClose, lead }) {
  const [nextDate, setNextDate] = useState(null);
  const [status, setStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetForm = () => { setNextDate(null); setStatus(''); setRemarks(''); };

  const handleSave = async () => {
    if (!lead) return;
    try {
      setSaving(true);
      await axiosInstance.post(endpoints.user.followupdate, {
        enquiry_id: lead.id,
        next_followup_date: nextDate ? nextDate.format('YYYY-MM-DD') : null,
        status,
        remarks,
      });
      setSuccessMsg('FollowUp saved successfully');
      setTimeout(() => { setSuccessMsg(''); resetForm(); onClose(); }, 1500);
    } catch (error) {
      setErrorMsg('Error saving follow up');
      setTimeout(() => setErrorMsg(''), 2000);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => { if (!open) { resetForm(); setErrorMsg(''); setSuccessMsg(''); } }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Follow Up</DialogTitle>
      <DialogContent>
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <Stack spacing={2} sx={{ mt: 1 }}>
          <DatePicker label="Next Follow-up Date" value={nextDate} onChange={setNextDate} slotProps={{ textField: { fullWidth: true } }} />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MuiMenuItem value="active">Active</MuiMenuItem>
              <MuiMenuItem value="closed">Closed</MuiMenuItem>
            </Select>
          </FormControl>
          <TextField label="Remarks" fullWidth multiline rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}

// Referred Modal
function ReferredModal({ open, onClose, lead }) {
  const [branch, setBranch] = useState('');
  const [employee, setEmployee] = useState('');
  const [remark, setRemarks] = useState('');
  const [branches, setBranches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => { if (open) { fetchBranches(); resetFields(); } }, [open]);

  const fetchBranches = async () => {
    try { setLoading(true); const res = await axiosInstance.get(endpoints.user.getallemployees); setBranches(res.data.branches || res.data || []); } 
    catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { if (branch) fetchEmployees(branch); else { setEmployees([]); setEmployee(''); } }, [branch]);

  const fetchEmployees = async (branchId) => {
    try { setEmployeeLoading(true); const res = await axiosInstance.get(endpoints.user.getemplbybranch(branchId)); setEmployees(res.data.employees || []); } 
    catch (error) { console.error(error); } 
    finally { setEmployeeLoading(false); }
  };

  const resetFields = () => { setBranch(''); setEmployee(''); setRemarks(''); setEmployees([]); };

  const handleSave = async () => {
    if (!lead) return;
    try {
      setSaving(true);
      await axiosInstance.post(endpoints.user.assignLead(lead.id), { branch_id: branch, employee_id: employee, remark });
      setSuccessMsg('Referred saved successfully');
      setTimeout(() => { setSuccessMsg(''); onClose(); }, 3000);
      resetFields();
    } catch (error) { setErrorMsg('Failed to save referred'); setTimeout(() => setErrorMsg(''), 3000); }
    finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Referred</DialogTitle>
      <DialogContent>
        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <Stack spacing={2} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Branch</InputLabel>
            <Select value={branch} onChange={(e) => setBranch(e.target.value)} label="Branch">
              {loading ? <MuiMenuItem disabled>Loading...</MuiMenuItem> : branches.map((b) => <MuiMenuItem key={b.id} value={b.id}>{b.branch_name}</MuiMenuItem>)}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Employee</InputLabel>
            <Select value={employee} onChange={(e) => setEmployee(e.target.value)} label="Employee" disabled={!branch}>
              {employeeLoading ? <MuiMenuItem disabled>Loading...</MuiMenuItem> :
                employees.length > 0 ? employees.map(emp => <MuiMenuItem key={emp.id} value={emp.id}>{emp.full_name} ({emp.employee_code})</MuiMenuItem>) :
                  <MuiMenuItem disabled>No employees found</MuiMenuItem>
              }
            </Select>
          </FormControl>

          <TextField label="Remarks" fullWidth multiline rows={3} value={remark} onChange={(e) => setRemarks(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Dialog>
  );
}
