import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, Stack, Alert, Button, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function EndUseAddView() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axiosInstance.post(endpoints.user.addenduse, { title });

            console.log("Response:", res.data);
            setSuccessMsg('End Use added successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
            setError('');
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError('Failed to add End Use.');
            setTimeout(() => setError(''), 3000);
            setSuccessMsg('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Add End Use"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'End Use', href: paths.dashboard.enduselistview },
                    { name: 'Add' },
                ]}
            />

            {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {!!error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Card sx={{ p: 3, mt: 3 }}>
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
                            >
                                {loading ? 'Saving...' : 'Save'}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Card>
        </DashboardContent>
    );
}
