import { Stack, TextField,MenuItem } from '@mui/material';
import { Controller } from 'react-hook-form';

export function SelfieForm({ control }) {
  return (
    <Stack spacing={2}>
       <Controller
              name="selfiePremisesType"
              control={control}
              render={({ field }) => (
                <TextField {...field} select label="Premises Type" fullWidth>
                  <MenuItem value="residence">Residence</MenuItem>
                  <MenuItem value="shop">Shop</MenuItem>
                  <MenuItem value="office">Office</MenuItem>
                </TextField>
              )}
            />
      {/* <Controller name="selfiePremisesType" control={control} render={({ field }) => <TextField {...field} label="Premises Type" fullWidth />} /> */}
    
    </Stack>
  );
}