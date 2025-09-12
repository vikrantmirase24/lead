import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card, Stack, Table, TableRow, MenuList, MenuItem,
    TableCell, TableBody, TextField, IconButton, InputAdornment,
    TableContainer, Button
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { useTable, TableHeadCustom, TablePaginationCustom } from 'src/components/table';

const TABLE_HEAD = [
    { id: 'id', label: 'Lead ID' },
    { id: 'name', label: 'Name' },
    { id: 'mobile', label: 'Mobile No' },
    { id: 'actions', label: 'Actions', width: 120 },
];

const DUMMY_LEADS = [
    { id: 101, name: 'Rahul Sharma', mobile_number: '9876543210' },
    { id: 102, name: 'Priya Verma', mobile_number: '9123456789' },
    { id: 103, name: 'Amit Singh', mobile_number: '9012345678' },
];

export default function AllLeadsIncomplete() {
    const table = useTable({ defaultRowsPerPage: 5 });
    const [search, setSearch] = useState('');
    const [leads] = useState(DUMMY_LEADS);

    const handleSearch = (e) => setSearch(e.target.value);

    const filteredLeads = leads.filter(
        (lead) =>
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.mobile_number.includes(search)
    );

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Incomplete All Leads"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Incomplete Leads' },
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
                                {filteredLeads.length > 0 ? (
                                    filteredLeads.map((lead) => (
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
                    count={filteredLeads.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
        </DashboardContent>
    );
}

function IncompleteTodayLeadTableRow({ row }) {
    const popover = usePopover();
    const navigate = useNavigate();

    const handleEdit = () => {
        popover.onClose();
        navigate(paths.dashboard.Allleadedit(row.id));
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

            {/* Action Popover */}
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
