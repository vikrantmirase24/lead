import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import {
    Card, Stack, Table, Button, TableRow, MenuList, MenuItem,
    TableCell, TableBody, TextField, IconButton, InputAdornment,
    TableContainer
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
    { id: 'id', label: 'Lead ID' },
    { id: 'title', label: 'Title' },
    { id: 'actions', label: 'Actions', width: 88 },
];

export function EndUseListView() {
    const table = useTable({ defaultRowsPerPage: 5 });
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState('');

    const fetchEndUse = useCallback(
        async (page = table.page, rowsPerPage = table.rowsPerPage, searchTerm = search) => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(endpoints.user.enduselist, {
                    params: {
                        page: page + 1,
                        page_size: rowsPerPage,
                        search: searchTerm || ''
                    }
                });

                const results = response.data.results || [];

                setLeads(results);
                setTotalCount(response.data.count || results.length);
            } catch (error) {
                console.error('Error fetching End Use:', error);
            } finally {
                setLoading(false);
            }
        },
        [table.page, table.rowsPerPage, search]
    );

    useEffect(() => {
        fetchEndUse();
    }, [fetchEndUse]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        table.onChangePage(null, 0);
        fetchEndUse(0, table.rowsPerPage, value);
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="End Use"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'End Use' },
                    { name: 'View' },
                ]}
                action={
                    <Stack direction="row" spacing={2}>
                        <Button
                            sx={{ mt: 5 }}
                            component={RouterLink}
                            variant="contained"
                            href={paths.dashboard.enduseadd}
                            startIcon={<Iconify icon="mingcute:add-line" />}
                        >
                            Add End Use
                        </Button>
                    </Stack>
                }
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
                                        <EndUseTableRow
                                            key={lead.id}
                                            row={lead}
                                            onDeleteSuccess={() => fetchEndUse(table.page, table.rowsPerPage, search)}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={TABLE_HEAD.length} align="center">
                                            No Data found.
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

function EndUseTableRow({ row, onDeleteSuccess }) {
    const popover = usePopover();
    const confirm = useBoolean();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleEdit = () => {
        popover.onClose();
        navigate(paths.dashboard.enduseedit(row.id));
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await axiosInstance.delete(endpoints.user.deleteenduse(row.id));
            confirm.onFalse();
            popover.onClose();
            onDeleteSuccess?.(); // refresh parent list after delete
        } catch (error) {
            console.error("Error deleting End Use:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TableRow hover>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.title}</TableCell>
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
                    <MenuItem onClick={confirm.onTrue} sx={{ color: "error.main" }}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                        Delete
                    </MenuItem>
                </MenuList>
            </CustomPopover>

            {/* ✅ Confirm dialog */}
            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete End Use"
                content="Are you sure you want to delete this End Use?"
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