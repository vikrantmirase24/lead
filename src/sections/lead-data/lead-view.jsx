import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
    Box, Card, Grid, Stack, Button, Typography, CircularProgress
} from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

export function LeadViewPage() {
    const { id } = useParams();
    const [lead, setLead] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchLeadDetail = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(endpoints.user.leadgetbyid(id));
                setLead(response.data.data);
            } catch (error) {
                console.error('Error fetching lead details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLeadDetail();
    }, [id]);

    const renderField = (label, value) => (
        <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
                {label}
            </Typography>
            <Typography variant="body1">{value || 'NA'}</Typography>
        </Grid>
    );
    return (
        <DashboardContent>
            <CustomBreadcrumbs
                heading="Lead Details"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Leads', href: paths.dashboard.activeLeads },
                    { name: 'View' },
                ]}
                sx={{ mb: { xs: 3, md: 3 } }}
            />

            {loading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ py: 5 }}>
                    <CircularProgress />
                </Stack>
            ) : lead ? (
                <Stack spacing={3}>
                    {/* --- Basic Info --- */}
                    <Card sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Basic Information</Typography>
                        <Grid container spacing={2}>
                            {renderField('Lead ID', lead.id)}
                            {renderField('Name', lead.name)}
                            {renderField('Mobile Number', lead.mobile_number)}
                            {renderField('LAN Number', lead.lan_number)}
                            {renderField('Occupation', lead.occupation_display)}
                            {renderField('Employer Name', lead.employer_name)}
                            {renderField('Years in Service', lead.number_of_years_service)}
                            {renderField('Official Contact', lead.official_contact_number)}
                            {renderField('Nature of Service', lead.nature_of_service)}
                            {renderField('Monthly Income', lead.monthly_income)}
                            {renderField('Business Name', lead.business_name)}
                            {renderField('Business Place', lead.business_place)}
                            {renderField('Business Contact', lead.business_contact_number)}
                            {renderField('Nature of Business', lead.nature_of_business)}
                            {renderField('KYC Document', lead.kyc_document)}
                            {renderField('KYC Number', lead.kyc_number)}
                            {renderField('KYC Collected', lead.kyc_collected ? 'Yes' : 'No')}
                            {renderField('Interested', lead.interested ? 'Yes' : 'No')}
                            {renderField('Status', lead.is_status_display)}
                            {renderField('Steps', lead.is_steps_display)}
                        </Grid>
                    </Card>

                    {/* --- Address Info --- */}
                    {lead.enquiry_addresses?.length > 0 && (
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Addresses</Typography>
                            {lead.enquiry_addresses.map((addr) => (
                                <Grid container spacing={2} key={addr.id} sx={{ mb: 2 }}>
                                    {renderField('Premises Type', addr.premises_type)}
                                    {renderField('Premises Status', addr.premises_status)}
                                    {renderField('Address', addr.address)}
                                    {renderField('Pincode', addr.pincode)}
                                    {renderField('State', addr.state)}
                                    {renderField('District', addr.district)}
                                    {renderField('Area', addr.area)}
                                    {renderField('Latitude', addr.latitude)}
                                    {renderField('Longitude', addr.longitude)}
                                    {renderField('Different Address', addr.use_different_address ? 'Yes' : 'No')}
                                    {renderField('Diff. Premises Type', addr.different_premises_type)}
                                    {renderField('Diff. Premises Status', addr.different_premises_status)}
                                    {renderField('Diff. Address', addr.different_address)}
                                    {renderField('Diff. Pincode', addr.different_pincode)}
                                </Grid>
                            ))}
                        </Card>
                    )}

                    {/* --- Loan Details --- */}
                    {lead.enquiry_loan_details?.length > 0 && (
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Loan Details</Typography>
                            {lead.enquiry_loan_details.map((loan) => (
                                <Grid container spacing={2} key={loan.id} sx={{ mb: 2 }}>
                                    {renderField('Loan Type', loan.loan_type_display)}
                                    {renderField('Loan Amount Range', loan.loan_amount_range_display)}
                                    {renderField('Property Type', loan.property_type_display)}
                                    {renderField('Property Document Type', loan.property_document_type_display)}
                                    {renderField('Sale Deed No', loan.sale_deed_number)}
                                    {renderField('Agreement Sell No', loan.agreement_sell_number)}
                                    {renderField('Property Document No', loan.property_document_number)}
                                    {renderField('Akhive Patrika', loan.akhive_patrika)}
                                    {renderField('Property Value', loan.property_value)}
                                    {renderField('Vehicle Registration No', loan.vehicle_registration_number)}
                                    {renderField('Income Document', loan.income_document)}
                                    {renderField('Follow-up Pickup Date', loan.followup_pickup_date)}
                                    {renderField('Remark', loan.remark)}
                                </Grid>
                            ))}
                        </Card>
                    )}

                    {/* --- Verification --- */}
                    {lead.enquiry_verification && (
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Verification</Typography>
                            <Grid container spacing={2}>
                                {renderField('Mobile', lead.enquiry_verification.mobile)}
                                {renderField('Mobile Status', lead.enquiry_verification.mobile_status_display)}
                                {renderField('Email', lead.enquiry_verification.email)}
                                {renderField('Email Verified', lead.enquiry_verification.email_status_display)}
                                {renderField('Aadhaar', lead.enquiry_verification.aadhaar)}
                                {renderField('Aadhaar Verified', lead.enquiry_verification.aadhaar_verified ? 'Yes' : 'No')}
                            </Grid>
                        </Card>
                    )}

                    {/* --- Images --- */}
                    {lead.enquiry_images?.length > 0 && (
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Uploaded Files
                            </Typography>
                            <Grid container spacing={2}>
                                {lead.enquiry_images.map((file) => {
                                    const fileUrl = `${import.meta.env.VITE_SERVER_URL}${file.media_file}`;
                                    const isPdf = fileUrl.toLowerCase().endsWith('.pdf');

                                    return (
                                        <Grid item xs={12} md={4} key={file.id}>
                                            <Box sx={{ position: "relative" }}>
                                                {isPdf ? (
                                                    <>
                                                        <Box
                                                            sx={{
                                                                width: "100%",
                                                                height: 200,
                                                                border: "1px solid #ddd",
                                                                borderRadius: 2,
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                backgroundColor: "#fafafa",
                                                            }}
                                                        >
                                                            <img
                                                                src="/assets/illustrations/pdf.jpg"
                                                                alt="PDF Logo"
                                                                style={{ width: 80, height: 80 }}
                                                            />
                                                        </Box>

                                                        <Button
                                                            variant="outlined"
                                                            href={fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{ mt: 1 }}
                                                        >
                                                            View PDF
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <>

                                                        <img
                                                            src={fileUrl}
                                                            alt="Lead Doc"
                                                            style={{
                                                                width: "100%",
                                                                height: "200px",
                                                                objectFit: "cover",
                                                                borderRadius: 8,
                                                                border: "1px solid #ddd",
                                                            }}
                                                        />

                                                        <Box
                                                            sx={{
                                                                position: "absolute",
                                                                bottom: 8,
                                                                left: 8,
                                                                bgcolor: 'rgba(184, 182, 182, 0.7)',
                                                                color: '#4e4e4eff',
                                                                p: 0.5,
                                                                borderRadius: 1,
                                                                fontSize: 10,
                                                                lineHeight: 1.3,
                                                                maxWidth: "85%",
                                                            }}
                                                        >
                                                            <div>Emp ID: {file.employee_id}</div>
                                                            <div>Premises: {file.premises_type}</div>
                                                            <div>Lat: {file.latitude}</div>
                                                            <div>Lng: {file.longitude}</div>
                                                            <div>IP: {file.ip_address}</div>
                                                            <div>Date: {file.capture_date}</div>
                                                            <div>Time: {file.capture_time}</div>
                                                        </Box>
                                                    </>
                                                )}
                                            </Box>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Card>
                    )}

                    {/* --- Selfies --- */}
                    {lead.enquiry_selfies?.length > 0 && (
                        <Card sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Selfies</Typography>
                            {lead.enquiry_selfies.map((selfie) => {
                                const selfieUrl = `${import.meta.env.VITE_SERVER_URL}${selfie.selfie}`;
                                return (
                                    <Grid container spacing={2} key={selfie.id} sx={{ mb: 3 }}>
                                        <Grid item xs={12} md={6}>
                                            <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                                                <img
                                                    src={selfieUrl}
                                                    alt="Lead Selfie"
                                                    style={{
                                                        width: '100%',
                                                        borderRadius: 8,
                                                        border: '1px solid #ddd',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 8,
                                                        left: 8,
                                                        bgcolor: 'rgba(184, 182, 182, 0.7)',
                                                        color: '#4e4e4eff',
                                                        p: 1,
                                                        borderRadius: 1,
                                                        fontSize: 10,
                                                        lineHeight: 1.4,
                                                        maxWidth: '90%',
                                                    }}
                                                >
                                                    <div>Emp ID: {selfie.employee_id}</div>
                                                    <div>Premises: {selfie.premises_type}</div>
                                                    <div>Lat: {selfie.latitude}</div>
                                                    <div>Lng: {selfie.longitude}</div>
                                                    <div>IP: {selfie.ip_address}</div>
                                                    <div>Date: {selfie.capture_date}</div>
                                                    <div>Time: {selfie.capture_time}</div>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </Card>
                    )}
                </Stack>
            ) : (
                <Card sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6">No data found</Typography>
                </Card>
            )}
        </DashboardContent>
    );
}
