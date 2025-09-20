import { useState, useEffect } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Card, Stack, Table, Select, TableRow, MenuList, MenuItem,
  TableCell, TableBody, TextField, InputLabel, IconButton, FormControl,
  InputAdornment, TableContainer, Collapse, Button,
  MenuItem as MuiMenuItem,
} from '@mui/material';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

const TABLE_HEAD = [
  { id: 'id', label: 'Lead ID' },
  { id: 'name', label: 'Name' },
  { id: 'mobile', label: 'Mobile No' },
  { id: 'actions', label: 'Actions', width: 88 },
];

export function ReportsListView() {
  const table = useTable({ defaultRowsPerPage: 5 });

  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [status, setStatus] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [salesExecutive, setSalesExecutive] = useState('');
  const [employee, setEmployee] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dateError, setDateError] = useState("");
  const [branches, setBranches] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [salesExecutives, setSalesExecutives] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leads, setLeads] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const statusOptions = [
    { value: '1', label: 'Open' },
    { value: '2', label: 'Closed' },
    { value: '3', label: 'Pending' },
    { value: '4', label: 'Today Followup' },
    { value: '5', label: 'Today Incomplete' },
    { value: '0', label: 'All Incomplte' },
  ];

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getallemployees);
        setBranches(res.data?.branches || []);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setBranches([]);
      }
    };
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get(endpoints.user.getallemployees);
        const empList = Array.isArray(res.data?.employees) ? res.data.employees : [];
        setAllEmployees(empList);
        setSalesExecutives(empList);
        setEmployees(empList);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setAllEmployees([]);
      }
    };
    fetchBranches();
    fetchEmployees();
  }, []);
  useEffect(() => {
    const fetchEmployeesByBranch = async () => {
      try {
        if (!selectedBranch) {
          setSalesExecutives(allEmployees);
          setEmployees(allEmployees);
          return;
        }
        const res = await axiosInstance.get(
          endpoints.user.getemplbybranch(selectedBranch)
        );
        const empList = Array.isArray(res.data?.employees) ? res.data.employees : [];
        setSalesExecutives(empList);
        setEmployees(empList);
      } catch (err) {
        console.error("Error fetching employees by branch:", err);
        setSalesExecutives([]);
        setEmployees([]);
      }
      setSalesExecutive('');
      setEmployee('');
    };
    fetchEmployeesByBranch();
  }, [selectedBranch, allEmployees]);
  const buildFilterPayload = (isDownload = false) => {
    const payload = {
      page: isDownload ? 1 : table.page + 1,
      page_size: isDownload ? (totalCount || 1000) : table.rowsPerPage,
    };
    if (search) payload.search = search;
    if (fromDate) payload.from_date = fromDate.format("YYYY-MM-DD");
    if (toDate) payload.to_date = toDate.format("YYYY-MM-DD");
    if (employee) payload.employee_id = employee;
    if (salesExecutive) payload.assign_to = salesExecutive;
    if (status) payload.status = parseInt(status, 10);
    return payload;
  };
  const handleSearch = async ({ pageOverride, pageSizeOverride } = {}) => {
    try {
      setLoading(true);
      if (fromDate && !toDate) {
        setDateError("Please select To Date when From Date is selected.");
        return;
      }
      setDateError("");
      const payload = buildFilterPayload(false);
      const { page, page_size, ...filters } = payload;
      // use explicit overrides if provided (note: page in API is 1-based)
      const finalPage = pageOverride ?? page;
      const finalPageSize = pageSizeOverride ?? page_size;
      const url = `${endpoints.user.getfilteradata}?page=${finalPage}&page_size=${finalPageSize}`;
      const response = await axiosInstance.post(url, filters);
      // backend uses 'results' (paginated) — fall back to 'data' if needed
      setLeads(response.data?.results || response.data?.data || []);
      setTotalCount(response.data?.count ?? response.data?.total_count ?? 0);
    } catch (error) {
      console.error("Error searching reports:", error);
      setLeads([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };
  const handleSearchClick = () => {
    setHasSearched(true);
    handleSearch(); // no overrides here — uses current table.page & table.rowsPerPage
  };
  const handleReset = async () => {
    setSearch("");
    setFromDate(null);
    setToDate(null);
    setStatus("");
    setSelectedBranch("");
    setSalesExecutive("");
    setEmployee("");
    try {
      setLoading(true);
      const payload = buildFilterPayload(false);
      const { page, page_size, ...filters } = payload;
      const url = `${endpoints.user.getfilteradata}?page=${page}&page_size=${page_size}`;
      const res = await axiosInstance.post(url, filters);
      setLeads(res.data?.data || []);
      setTotalCount(res.data?.count || 0);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLeads([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };
  const handledownload = async () => {
    try {
      setDownloadLoading(true);
      const payload = buildFilterPayload(true);
      const { page, page_size, ...filters } = payload;
      const response = await axiosInstance.post(
        endpoints.user.downloadreport,
        filters,
        { responseType: "blob" }
      );
      const contentDisposition = response.headers["content-disposition"];
      let filename = "enquiries_report.xlsx";
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match?.[1]) {
          filename = match[1].trim().replace(/[_]+$/, "");
        }
      }
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, filename);
    } catch (error) {
      console.error("Error downloading report:", error);
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="Reports"
          links={[
            { name: 'Dashboard', href: '/' },
            { name: 'Reports' },
            { name: 'View' },
          ]}
          sx={{ mb: { xs: 3, md: 3 } }}
        />
        <Card sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search by name or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <Iconify icon="eva:arrow-forward-outline" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Button
            onClick={() => setShowAdvanced(!showAdvanced)}
            startIcon={<Iconify icon={showAdvanced ? 'eva:arrow-up-fill' : 'eva:arrow-down-fill'} />}
            sx={{ mb: 2 }}
          >
            {showAdvanced ? 'Hide Advanced Search' : 'Show Advanced Search'}
          </Button>
          <Collapse in={showAdvanced}>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center">
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Branch</InputLabel>
                <Select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <MuiMenuItem value="">All</MuiMenuItem>
                  {branches.map((branch) => (
                    <MuiMenuItem key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Sales Executive</InputLabel>
                <Select
                  value={salesExecutive}
                  onChange={(e) => setSalesExecutive(e.target.value)}
                >
                  <MuiMenuItem value="">All</MuiMenuItem>
                  {salesExecutives.map((emp) => (
                    <MuiMenuItem key={emp.id} value={emp.id}>
                      {emp.full_name}  {/* <-- use full_name from API */}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Employee</InputLabel>
                <Select
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                >
                  <MuiMenuItem value="">All</MuiMenuItem>
                  {employees.map((emp) => (
                    <MuiMenuItem key={emp.id} value={emp.id}>
                      {emp.full_name}  {/* <-- use full_name from API */}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center">
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => {
                  setToDate(newValue);
                  if (fromDate && newValue) {
                    setDateError("");
                  }
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: Boolean(dateError),
                    helperText: dateError,
                  },
                }}
              />
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MuiMenuItem value="">All</MuiMenuItem>
                  {statusOptions.map((opt) => (
                    <MuiMenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MuiMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 2 }}
              justifyContent="flex-end"
            >
              <Button variant="contained" color="primary" onClick={handleSearchClick}>
                Search
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handledownload}
                disabled={downloadLoading}
              >
                {downloadLoading ? "Processing..." : "Download"}
              </Button>
            </Stack>
          </Collapse>
        </Card>
        <Card sx={{ mt: 3 }}>
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
                      <ReportTableRow
                        key={lead.id}
                        row={lead}
                        onDeleteSuccess={() =>
                          table.onChangePage(null, table.page)
                        }
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
            onPageChange={(e, newPage) => {
              // update table internal state
              table.onChangePage(e, newPage);
              // trigger search only if user already ran search once
              if (hasSearched) {
                // API expects 1-based page
                handleSearch({ pageOverride: newPage + 1 });
              }
            }}
            onRowsPerPageChange={(e) => {
              const newSize = parseInt(e.target.value, 10) || table.rowsPerPage;
              // update table internal state
              table.onChangeRowsPerPage(e);
              // if user already searched once, fetch again with new page_size and reset to page 1
              if (hasSearched) {
                handleSearch({ pageOverride: 1, pageSizeOverride: newSize });
              }
            }}
          />
        </Card>
      </DashboardContent>
    </LocalizationProvider>
  );
}

function ReportTableRow({ row, onDeleteSuccess }) {
  const popover = usePopover();
  const confirm = useBoolean();
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false); // renamed
  const handleEdit = () => {
    popover.onClose();
    navigate(`/dashboard/reports/edit/${row.id}`);
  };
  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await axiosInstance.delete(endpoints.user.deletereport(row.id));
      confirm.onFalse();
      popover.onClose();
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setDeleteLoading(false);
    }
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
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
          <MenuItem onClick={confirm.onTrue} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete Report"
        content="Are you sure you want to delete this report?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
