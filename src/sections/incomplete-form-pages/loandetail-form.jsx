import { Stack, TextField, MenuItem, Button } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export function LoanDetailsForm({ control }) {
    const loanType = useWatch({ control, name: 'loanTypeMaster' });
    const loanRequiredOn = useWatch({ control, name: 'loanRequiredOn' });
    const vehicleRegistration = useWatch({ control, name: "vehicleRegistration" });
    
    return (
        <Stack spacing={2}>
            {/* Loan Type Dropdown */}
            <Controller
                name="loanTypeMaster"
                control={control}
                render={({ field }) => (
                    <TextField {...field} select label="Loan Type" fullWidth>
                        <MenuItem value="two_wheeler">Two Wheeler</MenuItem>
                        <MenuItem value="lap">LAP</MenuItem>
                        <MenuItem value="personal_loan">Personal Loan</MenuItem>
                        <MenuItem value="secured_msme">Secured MSME</MenuItem>
                    </TextField>
                )}
            />

            {/* Two Wheeler Section */}
            {loanType === 'two_wheeler' && (
                <>
                    <Controller
                        name="loanAmount"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Loan Amount" fullWidth>
                                <MenuItem value="50000">50,000</MenuItem>
                                <MenuItem value="100000">1,00,000</MenuItem>
                                <MenuItem value="200000">2,00,000</MenuItem>
                                <MenuItem value="500000">5,00,000</MenuItem>
                            </TextField>
                        )}
                    />

                    <Controller
                        name="loanRequiredOn"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Loan Required On" fullWidth>
                                <MenuItem value="income">Income</MenuItem>
                                <MenuItem value="vehicle">Vehicle</MenuItem>
                                <MenuItem value="property">Property</MenuItem>
                            </TextField>
                        )}
                    />

                    {loanRequiredOn === "vehicle" && (
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
                            {vehicleRegistration && vehicleRegistration.trim() !== "" && (
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
                                        <MenuItem value="salary_slip">Salary Slip</MenuItem>
                                        <MenuItem value="itr">ITR</MenuItem>
                                        <MenuItem value="banking">Banking</MenuItem>
                                        <MenuItem value="form16">Form 16</MenuItem>
                                    </TextField>
                                )}
                            />
                        </>
                    )}
                </>
            )}

            {/* LAP Section */}
            {loanType === 'lap' && (
                <>
                    <Controller
                        name="loanAmount"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Loan Amount" fullWidth>
                                <MenuItem value="1000000">10 Lakhs</MenuItem>
                                <MenuItem value="2000000">20 Lakhs</MenuItem>
                                <MenuItem value="3000000">30 Lakhs</MenuItem>
                                <MenuItem value="5000000">50 Lakhs</MenuItem>
                            </TextField>
                        )}
                    />

                    <Controller
                        name="propertyType"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} select label="Property Type" fullWidth>
                                <MenuItem value="residential">Residential</MenuItem>
                                <MenuItem value="commercial">Commercial</MenuItem>
                                <MenuItem value="industrial">Industrial</MenuItem>
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
                            value={field.value ? dayjs(field.value) : null} // Convert string to Dayjs
                            onChange={(newValue) => field.onChange(newValue ? newValue.toISOString() : null)} // Save ISO string
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    )}
                />
            </LocalizationProvider>

            <Controller
                name="endUse"
                control={control}
                render={({ field }) => (
                    <TextField {...field} select label="End Use" fullWidth>
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="vehicle">Vehicle</MenuItem>
                        <MenuItem value="property">Property</MenuItem>
                    </TextField>
                )}
            />

            <Controller
                name="enquiryType"
                control={control}
                render={({ field }) => (
                    <TextField {...field} select label="Enquiry Type" fullWidth>
                        <MenuItem value="hot">Hot</MenuItem>
                        <MenuItem value="cold">Cold</MenuItem>
                    </TextField>
                )}
            />
            <Controller
                name="remark"
                control={control}
                render={({ field }) => <TextField {...field} label="Remark" multiline rows={3} fullWidth />}
            />
        </Stack>
    );
}
