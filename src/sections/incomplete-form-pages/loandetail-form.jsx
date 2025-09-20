import { useState, useEffect } from 'react';
import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import axiosInstance, { endpoints } from 'src/utils/axios';

export function LoanDetailsForm({ control, getValues, handleSave, pageType }) {
    const loanType = useWatch({ control, name: 'loanTypeMaster' });
    const loanRequiredOn = useWatch({ control, name: 'loanRequiredOn' });
    const vehicleRegistration = useWatch({ control, name: 'vehicleRegistration' });
    const [loanAmountOptions, setLoanAmountOptions] = useState([]);

    useEffect(() => {
        const fetchLoanAmounts = async () => {
            try {
                const res = await axiosInstance.get(endpoints.user.allLoanAmount);
                setLoanAmountOptions(res.data.data || []);
            } catch (error) {
                console.error("Error fetching loan amount ranges:", error);
            }
        };
        fetchLoanAmounts();
    }, []);

    const onSave = () => {
        const values = getValues();
        handleSave(values, pageType);
    };

    return (
        <Stack spacing={2}>
            <Controller
                name="loanTypeMaster"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="Loan Type"
                        fullWidth
                        value={field.value ?? ''}
                    >
                        <MenuItem value={1}>Two Wheeler</MenuItem>
                        <MenuItem value={2}>LAP</MenuItem>
                        <MenuItem value={3}>Personal Loan</MenuItem>
                        <MenuItem value={4}>Secured MSME</MenuItem>
                    </TextField>
                )}
            />

            {loanType === 1 && (
                <>
                    <Controller
                        name="loanAmount"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Loan Amount" fullWidth>
                                {loanAmountOptions.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.id}>
                                        {opt.loan_amount_from} - {opt.loan_amount_to}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="loanRequiredOn"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Loan Required On" fullWidth>
                                <MenuItem value={1}>Income</MenuItem>
                                <MenuItem value={2}>Vehicle</MenuItem>
                                <MenuItem value={3}>Property</MenuItem>
                            </TextField>
                        )}
                    />

                    {loanRequiredOn === 2 && (
                        <>
                            {/* Vehicle Number Input */}
                            <Controller
                                name="vehicleRegistration"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Vehicle Registration No" fullWidth />
                                )}
                            />

                            {/* Show buttons only if vehicle number entered */}
                            {vehicleRegistration && vehicleRegistration.trim() !== '' && (
                                <Stack direction="row" spacing={2}>
                                    <Button variant="contained" color="primary">
                                        Verify
                                    </Button>
                                    <Button variant="outlined" color="secondary">
                                        View Details
                                    </Button>
                                </Stack>
                            )}

                            <Controller
                                name="incomeDocument"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} select label="Income Document" fullWidth>
                                        <MenuItem value={1}>Salary Slip</MenuItem>
                                        <MenuItem value={2}>ITR</MenuItem>
                                        <MenuItem value={3}>Banking</MenuItem>
                                        <MenuItem value={4}>Form 16</MenuItem>
                                    </TextField>
                                )}
                            />
                        </>
                    )}
                </>
            )}

            {/* LAP Section */}
            {loanType === 2 && (
                <>
                    <Controller
                        name="loanAmount"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Loan Amount" fullWidth>
                                {loanAmountOptions.map((opt) => (
                                    <MenuItem key={opt.id} value={opt.id}>
                                        {opt.loan_amount_from} - {opt.loan_amount_to}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    <Controller
                        name="propertyType"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Property Type" fullWidth>
                                <MenuItem value={1}>Residential</MenuItem>
                                <MenuItem value={2}>Commercial</MenuItem>
                                <MenuItem value={3}>Industrial</MenuItem>
                            </TextField>
                        )}
                    />

                    <Controller
                        name="propertyDocument"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Property Document" fullWidth />
                        )}
                    />

                    <Controller
                        name="propertyValue"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Property Value (in Lakhs)" fullWidth />
                        )}
                    />
                </>
            )}

            {/* Always Visible Fields */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name="followupPickupDate"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="Followup Pickup Date"
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) =>
                                field.onChange(newValue ? newValue.toISOString() : null)
                            }
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    )}
                />
            </LocalizationProvider>

            <Controller
                name="endUse"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="End Use"
                        fullWidth
                        value={field.value ?? ''}   // ✅ null → ''
                    >
                        <MenuItem value={1}>Income</MenuItem>
                        <MenuItem value={2}>Vehicle</MenuItem>
                        <MenuItem value={3}>Property</MenuItem>
                    </TextField>
                )}
            />

            <Controller
                name="enquiryType"
                control={control}
                render={({ field }) => (
                    <TextField {...field} select label="Enquiry Type" fullWidth>
                        <MenuItem value={1}>Hot</MenuItem>
                        <MenuItem value={2}>Cold</MenuItem>
                    </TextField>
                )}
            />

            <Controller
                name="remark"
                control={control}
                render={({ field }) => (
                    <TextField {...field} label="Remark" multiline rows={3} fullWidth />
                )}
            />
            <Stack direction="row" justifyContent="flex-end" mt={2}>
                <Button variant="contained" onClick={() => handleSave(getValues(), 'loan')}>
                    Save
                </Button>
            </Stack>
        </Stack>
    );
}
