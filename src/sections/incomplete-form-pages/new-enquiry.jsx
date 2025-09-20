import { useState, useEffect } from "react";
import { Stack, TextField, MenuItem, Grid, Button } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';

export default function NewEnquiryForm({ control, getValues, handleSave, pageType }) {
  const occupationType = useWatch({ control, name: 'occupationType' });
  const kycDocument = useWatch({ control, name: 'kycDocument' });
  const [businessOptions, setBusinessOptions] = useState([]);

  const onSave = () => {
    const values = getValues();  // ✅ get all current form values
    handleSave(values, pageType);
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await axiosInstance.get(endpoints.user.allNatureBusiness);
        const list = response.data?.data || [];
        setBusinessOptions(list);
      } catch (error) {
        console.error("Error fetching business options:", error);
        setBusinessOptions([]); // prevent crash
      }
    };

    fetchBusiness();
  }, []);

  return (
    <Stack spacing={2}>
      {/* Customer Name + Mobile */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="customerName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Customer Name" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Mobile No"
                fullWidth
                inputProps={{ maxLength: 10 }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/* Occupation Type */}
      <Controller
        name="occupationType"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Occupation Type" fullWidth>
            <MenuItem value={1}>Salaried</MenuItem>
            <MenuItem value={2}>Self Employed</MenuItem>
          </TextField>
        )}
      />

      {/* Salaried Fields */}
      {occupationType === 1 && (
        <>
          <Controller
            name="employerName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Employer Name" fullWidth />
            )}
          />
          <Controller
            name="yearsInService"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="No. of Years in Service" type="number" fullWidth />
            )}
          />
          <Controller
            name="officialContact"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Official Contact Number" fullWidth />
            )}
          />
          <Controller
            name="natureOfService"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Nature of Service" fullWidth />
            )}
          />
          <Controller
            name="annualIncome"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Annual Income (in Lakhs)" fullWidth />
            )}
          />
        </>
      )}

      {/* Self Employed Fields */}
      {occupationType === 2 && (
        <>
          <Controller
            name="businessName"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Business Name" fullWidth />
            )}
          />
          <Controller
            name="businessPlace"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Business Place" fullWidth />
            )}
          />
          <Controller
            name="businessContact"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Business Contact Number" fullWidth />
            )}
          />
          <Controller
            name="natureOfBusiness"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Nature of Business" fullWidth>
                {businessOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="income"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Annual Income (in Lakhs)" fullWidth />
            )}
          />
        </>
      )}

      {/* KYC Section */}
      <Controller
        name="kycDocument"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Select KYC Document" fullWidth>
            <MenuItem value="Aadhaar Card">Aadhaar Card</MenuItem>
            <MenuItem value="PAN Card">PAN Card</MenuItem>
            <MenuItem value="Voter ID">Voter ID</MenuItem>
            <MenuItem value="Driving License">Driving License</MenuItem>
          </TextField>
        )}
      />

      {/* KYC Input Based on Selection */}
      {kycDocument === "Aadhaar Card" && (
        <Controller
          name="kycNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter Aadhaar Number"
              fullWidth
              inputProps={{ maxLength: 12 }}
            />
          )}
        />
      )}

      {kycDocument === "PAN Card" && (
        <Controller
          name="panNumber"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Enter PAN Number" fullWidth inputProps={{ maxLength: 10 }} />
          )}
        />
      )}

      {kycDocument === "Voter ID" && (
        <Controller
          name="voterId"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Enter Voter ID" fullWidth />
          )}
        />
      )}

      {kycDocument === "Driving License" && (
        <Controller
          name="drivingLicense"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Enter Driving License" fullWidth />
          )}
        />
      )}

      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={() => handleSave(getValues(), 'enquiry')}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}
