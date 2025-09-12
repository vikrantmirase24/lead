import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Card, Stack, Alert, Button, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function EndUseEditView() {
    
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(endpoints.user.endusebyid(id));
                const record = res.data?.data || res.data;
                setTitle(record?.title || '');
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch End Use");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        try {
            setLoading(true);
            const res = await axiosInstance.patch(endpoints.user.endusebyid(id), { title });

            if (res.data?.success) {
                setSuccessMsg('End Use updated successfully!');
                setTimeout(() => setSuccessMsg(''), 3000);
            } else {
                setError('End Use updated Failed!');
                setTimeout(() => setError(''), 3000);
            }
        } catch (err) {
            setError('End Use updated Failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Edit End Use"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'End Use', href: paths.dashboard.enduselistview },
                    { name: 'Edit' },
                ]}
            />

            {!!successMsg && <Alert severity="success" sx={{ mb: 1 }}>{successMsg}</Alert>}
            {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Card sx={{ p: 3, mt: 2 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="End Use Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                        />

                        <Stack direction="row" justifyContent="flex-end" spacing={2}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={() => navigate(paths.dashboard.enduselist)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={<Iconify icon="solar:pen-bold" />}
                            >
                                {loading ? 'Saving...' : 'Update'}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Card>
        </DashboardContent>
    );
}
