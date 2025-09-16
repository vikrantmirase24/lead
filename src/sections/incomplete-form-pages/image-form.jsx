import { Stack, TextField, MenuItem, Button,Typography, Grid } from "@mui/material";
import { Controller, useWatch } from "react-hook-form";

export function ImageForm({ control }) {
  const docCategory = useWatch({ control, name: "docCategory" });

  return (
    <Stack spacing={2}>
      {/* Document Category */}
      <Controller
        name="docCategory"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Document" fullWidth>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="kyc">KYC</MenuItem>
            <MenuItem value="income">Income Documents</MenuItem>
            <MenuItem value="property">Property Documents</MenuItem>
          </TextField>
        )}
      />

      {/* KYC Docs */}
      {docCategory === "kyc" && (
        <Controller
          name="kycDocType"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="KYC Document" fullWidth>
              <MenuItem value="aadhar">Aadhar</MenuItem>
              <MenuItem value="pan">PAN</MenuItem>
              <MenuItem value="voter_id">Voter ID</MenuItem>
              <MenuItem value="passport">Passport</MenuItem>
            </TextField>
          )}
        />
      )}

      {/* Income Docs */}
      {docCategory === "income" && (
        <Controller
          name="incomeDocType"
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
      )}

      {/* Property Docs */}
      {docCategory === "property" && (
        <Controller
          name="propertyDocType"
          control={control}
          render={({ field }) => (
            <TextField {...field} select label="Property Document" fullWidth>
              <MenuItem value="sale_deed">Sale Deed</MenuItem>
              <MenuItem value="agreement">Agreement</MenuItem>
              <MenuItem value="tax_receipt">Tax Receipt</MenuItem>
              <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
            </TextField>
          )}
        />
      )}

      {/* Premises Type */}
      <Controller
        name="imgPremisesType"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Premises Type" fullWidth>
            <MenuItem value="residence">Residence</MenuItem>
            <MenuItem value="shop">Shop</MenuItem>
            <MenuItem value="office">Office</MenuItem>
          </TextField>
        )}
      />

      {/* Upload Button */}
      <Stack spacing={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            <Controller
              name="uploadedFile"
              control={control}
              render={({ field }) => (
                <>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                  >
                    Upload
                    <input
                      hidden
                      accept="image/*,application/pdf"
                      type="file"
                      onChange={(e) => field.onChange(e.target.files[0])}
                    />
                  </Button>
                </>
              )}
            />
          </Grid>

          <Grid item xs={9}>
            <Controller
              name="uploadedFile"
              control={control}
              render={({ field }) =>
                field.value && (
                  <Typography variant="body2" noWrap>
                    📂 {field.value.name}
                  </Typography>
                )
              }
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
}
