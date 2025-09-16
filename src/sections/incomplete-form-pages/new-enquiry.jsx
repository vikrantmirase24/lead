import { Stack, TextField, MenuItem, Grid } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';

export default function NewEnquiryForm({ control }) {
  const occupationType = useWatch({ control, name: 'occupationType' });
  const kycDocument = useWatch({ control, name: 'kycDocument' });

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

      {/* Email + Address */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Email" fullWidth />
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Address" fullWidth multiline rows={2} />
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
            <MenuItem value="salaried">Salaried</MenuItem>
            <MenuItem value="self_employed">Self Employed</MenuItem>
          </TextField>
        )}
      />

      {/* Conditional Fields Based on Occupation */}
      {occupationType === 'salaried' && (
        <Controller
          name="companyName"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Company Name" fullWidth />
          )}
        />
      )}
      {occupationType === 'self_employed' && (
        <Controller
          name="businessName"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Business Name" fullWidth />
          )}
        />
      )}

      {/* KYC Section */}
      <Controller
        name="kycDocument"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Select KYC Document" fullWidth>
            <MenuItem value="aadhar">Aadhar</MenuItem>
            <MenuItem value="pan">PAN Card</MenuItem>
            <MenuItem value="voter">Voter ID</MenuItem>
            <MenuItem value="driving">Driving License</MenuItem>
          </TextField>
        )}
      />

      {/* KYC Input Based on Selection */}
      {kycDocument === 'aadhar' && (
        <Controller
          name="aadharNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter Aadhar Number"
              fullWidth
              inputProps={{ maxLength: 12 }}
            />
          )}
        />
      )}
      {kycDocument === 'pan' && (
        <Controller
          name="panNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Enter PAN Number"
              fullWidth
              inputProps={{ maxLength: 10 }}
            />
          )}
        />
      )}
      {kycDocument === 'voter' && (
        <Controller
          name="voterId"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Enter Voter ID" fullWidth />
          )}
        />
      )}
      {kycDocument === 'driving' && (
        <Controller
          name="drivingLicense"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Enter Driving License" fullWidth />
          )}
        />
      )}
    </Stack>
  );
}
