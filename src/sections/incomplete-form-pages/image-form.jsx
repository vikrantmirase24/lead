import { useState } from "react";
import { Stack, TextField, MenuItem, Button, Typography, Grid } from "@mui/material";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import axiosInstance, { endpoints } from 'src/utils/axios';

export function ImageForm({ control, enquiryId }) {
  const docCategory = useWatch({ control, name: "docCategory" });
  const imgPremisesType = useWatch({ control, name: "imgPremisesType" });
  const uploadedFile = useWatch({ control, name: "uploadedFile" });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const docTypeMap = { image: 1, kyc: 2, income: 3, property: 4 };

  const handleImageUpload = async () => {
    if (!uploadedFile) {
      setErrorMsg("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("enquiry", enquiryId);
      formData.append("document_types", docTypeMap[docCategory]); // send integer
      formData.append("premises_type", imgPremisesType || "");

      formData.append("media_file", uploadedFile); // attach file

      await axiosInstance.post(
        endpoints.user.imageUpload(enquiryId), // ✅ use endpoint from endpoints.user
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMsg("Image uploaded successfully!");
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to upload image!");
    }
  };

  return (
    <Stack spacing={2}>
      {/* Document Category */}
      <Controller
        name="docCategory"
        control={control}
        render={({ field }) => (
          <TextField {...field} select label="Document" fullWidth value={field.value || ''}>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="kyc">KYC</MenuItem>
            <MenuItem value="income">Income Documents</MenuItem>
            <MenuItem value="property">Property Documents</MenuItem>
          </TextField>
        )}
      />

      {/* Conditional Document Type Fields */}
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
            <MenuItem value="Residence">Residence</MenuItem>
            <MenuItem value="Shop">Shop</MenuItem>
            <MenuItem value="Office">Office</MenuItem>
          </TextField>
        )}
      />

      {/* Upload Button */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <Controller
            name="uploadedFile"
            control={control}
            render={({ field }) => (
              <Button variant="contained" component="label" fullWidth>
                Upload
                <input
                  hidden
                  accept="image/*,application/pdf"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) field.onChange(file);
                  }}
                />
              </Button>
            )}
          />
        </Grid>

        <Grid item xs={9}>
          {uploadedFile && (
            <Typography variant="body2" noWrap>
              {uploadedFile instanceof File
                ? `📂 ${uploadedFile.name}`
                : uploadedFile.previewUrl
                  ? <a href={uploadedFile.previewUrl} target="_blank" rel="noopener noreferrer">📷 View Existing Image</a>
                  : null
              }
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Save Button */}
      <Button variant="contained" onClick={handleImageUpload}>
        Save Image
      </Button>

      {/* Success / Error Messages */}
      {successMsg && <Typography color="green">{successMsg}</Typography>}
      {errorMsg && <Typography color="red">{errorMsg}</Typography>}
    </Stack>
  );
}
