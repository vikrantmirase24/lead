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

  const statusOptions = [
    { value: '1', label: 'Open' },
    { value: '2', label: 'Closed' },
    { value: '3', label: 'Pending' },
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

  const handleSearch = async () => {
    try {
      setLoading(true);

      if (fromDate && !toDate) {
        setDateError("Please select To Date when From Date is selected.");
        return;
      }
      setDateError("");
      const payload = {
        page: table.page + 1,
        page_size: table.rowsPerPage,
      };
      if (search) payload.search = search;
      if (fromDate) payload.from_date = fromDate.format("YYYY-MM-DD");
      if (toDate) payload.to_date = toDate.format("YYYY-MM-DD");
      if (employee) payload.employee_id = employee;
      if (salesExecutive) payload.assign_to = salesExecutive;
      if (status) payload.status = status;

      const response = await axiosInstance.post(endpoints.user.getfilteradata, payload);
      setLeads(response.data?.data || []);
      setTotalCount(response.data?.count || 0);
    } catch (error) {
      console.error("Error searching reports:", error);
      setLeads([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearch("");
    setFromDate(null);
    setToDate(null);
    setStatus("");
    setSelectedBranch("");
    setSalesExecutive("");
    setEmployee("");

    // fetch all data again
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${endpoints.user.getallreports}?page=${table.page + 1}&page_size=${table.rowsPerPage}`
      );
      setLeads(res.data?.results || []);
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
      setLoading(true);

      const payload = { page: 1, page_size: totalCount || 1000 };
      if (search) payload.search = search;
      if (fromDate) payload.from_date = fromDate.format("YYYY-MM-DD");
      if (toDate) payload.to_date = toDate.format("YYYY-MM-DD");
      if (employee) payload.employee_id = employee;
      if (salesExecutive) payload.assign_to = salesExecutive;
      if (status) payload.status = status;

      const response = await axiosInstance.post(endpoints.user.getfilteradata, payload);
      const rows = response.data?.data || [];

      if (!rows.length) {
        alert("No data available to download.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, "reports.xlsx");
    } catch (error) {
      console.error("Error downloading reports:", error);
    } finally {
      setLoading(false);
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
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
              >
                Download
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
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
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
  const [loading, setLoading] = useState(false);

  const handleEdit = () => {
    popover.onClose();
    navigate(`/dashboard/reports/edit/${row.id}`);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete(endpoints.user.deletereport(row.id));
      confirm.onFalse();
      popover.onClose();
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Error deleting report:", error);
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        }
      />
    </>
  );
}
