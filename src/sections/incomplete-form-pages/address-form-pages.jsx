import { Stack, TextField, MenuItem, Grid, FormControlLabel, Checkbox, Button } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';

export function AddressForm({ control, getValues, handleSave, pageType }) {
  const useDifferentAddress = useWatch({ control, name: "useDifferentAddress" });

  const onSave = () => {
    const values = getValues();
    handleSave(values, pageType);
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller
            name="premisesType"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Premises Type" fullWidth>
                <MenuItem value="Residence">Residence</MenuItem>
                <MenuItem value="Office">Office</MenuItem>
                <MenuItem value="Shop">Shop</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={6}>
          <Controller
            name="premisesStatus"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Premises Status" fullWidth>
                <MenuItem value="Rented">Rented</MenuItem>
                <MenuItem value="Owned">Owned</MenuItem>
                <MenuItem value="Not Confirm">Not Confirm</MenuItem>
              </TextField>
            )}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller name="address" control={control} render={({ field }) => <TextField {...field} label="Address" fullWidth multiline rows={2} />} />
        </Grid>
        <Grid item xs={6}>
          <Controller name="pincode" control={control} render={({ field }) => <TextField {...field} label="Pincode" fullWidth />} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Controller name="latitude" control={control} render={({ field }) => <TextField {...field} label="Latitude" fullWidth />} />
        </Grid>
        <Grid item xs={6}>
          <Controller name="longitude" control={control} render={({ field }) => <TextField {...field} label="Longitude" fullWidth />} />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Controller name="state" control={control} render={({ field }) => <TextField {...field} label="State" fullWidth />} />
        </Grid>
        <Grid item xs={4}>
          <Controller name="district" control={control} render={({ field }) => <TextField {...field} label="District" fullWidth />} />
        </Grid>
        <Grid item xs={4}>
          <Controller name="area" control={control} render={({ field }) => <TextField {...field} label="Area" fullWidth />} />
        </Grid>
      </Grid>

      {/* ✅ Checkbox for Different Address */}
      <Controller
        name="useDifferentAddress"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={<Checkbox {...field} checked={field.value || false} />}
            label="Use Different Address"
          />
        )}
      />

      {/* ✅ Show second address form if checkbox checked */}
      {useDifferentAddress && (
        <Stack spacing={2} sx={{ mt: 2, borderTop: "1px solid #ddd", pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="differentPremisesType"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Different Premises Type" fullWidth>
                    <MenuItem value="residence">Residence</MenuItem>
                    <MenuItem value="office">Office</MenuItem>
                    <MenuItem value="shop">Shop</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="differentPremisesStatus"
                control={control}
                render={({ field }) => (
                  <TextField {...field} select label="Different Premises Status" fullWidth>
                    <MenuItem value="rented">Rented</MenuItem>
                    <MenuItem value="owned">Owned</MenuItem>
                    <MenuItem value="not_confirm">Not Confirm</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="differentAddress"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Different Address"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name="differentPincode"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Different Pincode"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Controller
                name="differentLatitude"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Different Latitude"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller name="differentLongitude" control={control} render={({ field }) => <TextField {...field} label="Different Longitude" fullWidth />} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Controller name="differentState" control={control} render={({ field }) => <TextField {...field} label="Different State" fullWidth />} />
            </Grid>
            <Grid item xs={4}>
              <Controller name="differentDistrict" control={control} render={({ field }) => <TextField {...field} label="Different District" fullWidth />} />
            </Grid>
            <Grid item xs={4}>
              <Controller name="differentArea" control={control} render={({ field }) => <TextField {...field} label="Different Area" fullWidth />} />
            </Grid>
          </Grid>
        </Stack>
      )}
      <Stack direction="row" justifyContent="flex-end" mt={2}>
        <Button variant="contained" onClick={() => handleSave(getValues(), 'address')}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
}