import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
    Box,
    Card,
    Grid,
    Stack,
    Alert,
    Button,
    Select,
    MenuItem,
    Typography,
    FormControl,
    CircularProgress
} from "@mui/material";

import { paths } from "src/routes/paths";

import axiosInstance, { endpoints } from "src/utils/axios";

import { DashboardContent } from "src/layouts/dashboard";

import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

export function TIcketViewbyIdViewPage() {
    const { id } = useParams();
    const [Ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState(""); 
    const [updating, setUpdating] = useState(false);

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const BASE_URL = "https://lead.berarfinance.com/leadapi/media/";

    useEffect(() => {
        if (!id) return;
        const fetchTicketDetail = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    endpoints.user.Ticketgetbyid(id)
                );
                console.log("Ticket Detail:", response.data.data);
                setTicket(response.data.data);
                setStatus(response.data.data.status); // numeric status
            } catch (error) {
                console.error("Error fetching Ticket details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTicketDetail();
    }, [id]);

    const handleSubmitStatus = async () => {
        try {
            setUpdating(true);
            await axiosInstance.patch(endpoints.user.Ticketgetbyid(id), {
                status, 
            });

            setTicket((prev) => ({
                ...prev,
                status, 
                status_display:
                    status === 1
                        ? "Open"
                        : status === 2
                            ? "Closed"
                            : status === 3
                                ? "Working/Active"
                                : status === 4
                                    ? "Reject"
                                    : prev.status_display,
            }));
            setSuccessMsg('Status Updtated Successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Error updating status:", error);
            setErrorMsg('Status Updtation Failed!');
            setTimeout(() => setErrorMsg(''), 3000);
        } finally {
            setUpdating(false);
        }
    };

    const renderField = (label, value) => (
        <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">{value || "NA"}</Typography>
        </Grid>
    );

    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Ticket Details"
                links={[
                    { name: "Dashboard", href: paths.dashboard.root },
                    { name: "Tickets", href: paths.dashboard.activeTickets },
                    { name: "View" },
                ]}
                sx={{ mb: { xs: 3, md: 3 } }}
            />

            {successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
            {errorMsg && <Alert severity="error" sx={{ mb: 3 }}>{errorMsg}</Alert>}

            {loading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
                    <CircularProgress />
                </Stack>
            ) : Ticket ? (
                <Stack spacing={3}>
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Ticket Information
                        </Typography>
                        <Grid container spacing={2}>
                            {renderField("Ticket ID", Ticket.id)}
                            {renderField("Title", Ticket.title)}
                            {renderField("Description", Ticket.description)}

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Attachment
                                </Typography>
                                {Ticket.attachment ? (
                                    <Box>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            component="a"
                                            href={
                                                Ticket.attachment.startsWith("http")
                                                    ? Ticket.attachment
                                                    : `${BASE_URL}${Ticket.attachment}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            View
                                        </Button>
                                    </Box>
                                ) : (
                                    <Typography variant="body1">No Attachment</Typography>
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Status
                                </Typography>
                                <FormControl fullWidth size="small">
                                    <Select
                                        labelId="status-label"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        disabled={updating}
                                    >
                                        <MenuItem value={1}>Open</MenuItem>
                                        <MenuItem value={2}>Closed</MenuItem>
                                        <MenuItem value={3}>Working/Active</MenuItem>
                                        <MenuItem value={4}>Reject</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {renderField("Status (Display)", Ticket.status_display)}
                            {renderField("Priority", Ticket.priority_display)}

                            <Grid item xs={12}>
                                <Stack direction="row" justifyContent="flex-end">
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitStatus}
                                        disabled={updating}
                                    >
                                        {updating ? "Updating..." : "Submit"}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Card>
                </Stack>
            ) : (
                <Card sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="h6">No data found</Typography>
                </Card>
            )}
        </DashboardContent>
    );
}
