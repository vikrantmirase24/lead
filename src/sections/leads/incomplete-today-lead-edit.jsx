import { useState, useEffect } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useParams } from 'react-router-dom';
import {
  Card, Tabs, Tab, Box, Stack, TextField, MenuItem, Button, FormControlLabel, Checkbox,
  Grid
} from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import { useForm, useWatch } from 'react-hook-form';
import NewEnquiryForm from '../incomplete-form-pages/new-enquiry';
import { AddressForm } from '../incomplete-form-pages/address-form-pages';
import { VerificationForm } from '../incomplete-form-pages/verification-form';
import { LoanDetailsForm } from '../incomplete-form-pages/loandetail-form';
import { ImageForm } from '../incomplete-form-pages/image-form';
import { SelfieForm } from '../incomplete-form-pages/selfie-form';
// ----------------------------------------------------------------------

export default function EditIncompleteLeadPage() {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState(0);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      // 🔹 New Enquiry
      customerName: '',
      mobile: '',
      loanType: '',
      occupationType: '',
      employerName: '',
      yearsInService: '',
      officialContact: '',
      natureOfService: '',
      annualIncome: '',
      businessName: '',
      businessPlace: '',
      businessContact: '',
      natureOfBusiness: '',
      businessIncome: '',
      interested: '',
      kycCollected: '',
      kycDocument: '',
      kycNumber: '',

      // 🔹 Address
      premisesType: '',
      premisesStatus: '',
      address: '',
      pincode: '',
      latitude: '',
      longitude: '',
      state: '',
      district: '',
      area: '',
      useDifferentAddress: false,
      diffPremisesType: '',
      diffPremisesStatus: '',
      diffAddress: '',
      diffPincode: '',
      diffLatitude: '',
      diffLongitude: '',
      diffState: '',
      diffDistrict: '',
      diffArea: '',

      // 🔹 Loan Details
      loanTypeMaster: '',
      loanAmount: '',
      propertyType: '',
      propertyDocument: '',
      propertyDocumentNumber: '',
      propertyValue: '',
      loanRequiredOn: '',
      vehicleRegistration: '',
      incomeDocument: '',
      followupPickupDate: '',
      endUse: '',
      enquiryType: '',
      remark: '',

      // 🔹 Verification
      mobileOtp: '',
      emailOtp: '',
      aadharOtp: '',

      // 🔹 Image
      docCategory: '',
      kycDocType: '',
      incomeDocType: '',
      propertyDocType: '',
      employeeCode: '',
      imageDate: '',
      imageTime: '',
      ipAddress: '',
      imgLatitude: '',
      imgLongitude: '',
      imgPremisesType: '',

      // 🔹 Selfies
      selfiePremisesType: '',
      selfieEmployeeCode: '',
      selfieDate: '',
      selfieTime: '',
      selfieIpAddress: '',
      selfieLatitude: '',
      selfieLongitude: '',
    },
  });

  const handleSave = (data) => {
    console.log("Form Submitted:", data);
  };

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axiosInstance.get(`/api/lead/enquiries/${id}/`);
        console.log("Fetched Lead Data:", response.data);
        const lead = response.data.data;

        // 🔹 Pick first address if exists
        const address = lead.enquiry_addresses?.length > 0 ? lead.enquiry_addresses[0] : {};

        const mappedData = {
          // --- New Enquiry ---
          customerName: lead.name || '',
          mobile: lead.mobile_number || '',
          occupationType: lead.occupation_display?.toLowerCase() || '',
          employerName: lead.employer_name || '',
          yearsInService: lead.number_of_years_service || '',
          officialContact: lead.official_contact_number || '',
          natureOfService: lead.nature_of_service || '',
          annualIncome: lead.income || '',
          businessName: lead.business_name || '',
          businessPlace: lead.business_place || '',
          businessContact: lead.business_contact_number || '',
          natureOfBusiness: lead.nature_of_business_display || '',
          interested: lead.interested || false,
          kycCollected: lead.kyc_collected || false,
          kycDocument: lead.kyc_document || '',
          kycNumber: lead.kyc_number || '',

          // --- Address (from first item) ---
          premisesType: address.premises_type || '',
          premisesStatus: address.premises_status?.toLowerCase() || '',
          address: address.address || '',
          pincode: address.pincode || '',
          latitude: address.latitude || '',
          longitude: address.longitude || '',
          state: address.state || '',
          district: address.district || '',
          area: address.area || '',
          useDifferentAddress: address.use_different_address || false,

          diffPremisesType: address.different_premises_type || '',
          diffPremisesStatus: address.different_premises_status || '',
          diffAddress: address.different_address || '',
          diffPincode: address.different_pincode || '',
          diffLatitude: address.different_latitude || '',
          diffLongitude: address.different_longitude || '',
          diffState: address.different_state || '',
          diffDistrict: address.different_district || '',
          diffArea: address.different_area || '',

          // --- Verification ---
          mobileNumber: lead.enquiry_verification?.mobile || '',
          email: lead.enquiry_verification?.email || '',
          aadhar: lead.enquiry_verification?.aadhaar || '',

          // statuses come from correct place
          mobileVerified: lead.enquiry_verification?.mobile_status === 1,
          emailVerified: lead.enquiry_verification?.email_status === 1,
          aadharVerified: lead.enquiry_verification?.aadhaar_verified || false,
        };

        reset(mappedData);
      } catch (error) {
        console.error("Failed to fetch lead:", error);
      }
    };

    if (id) fetchLead();
  }, [id, reset]);

  const mobileVerified = useWatch({ control, name: 'mobileVerified' });
  const emailVerified = useWatch({ control, name: 'emailVerified' });
  const aadharVerified = useWatch({ control, name: 'aadharVerified' });

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit Incomplete Lead"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Incomplete Today Leads', href: paths.dashboard.incompleteTodayLead },
          { name: 'Edit' },
        ]}
        sx={{ mb: { xs: 3, md: 3 } }}
      />

      <Card>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ ml: 3 }}>
          <Tab label="New Enquiry" />
          <Tab label="Address" />
          <Tab label="Verification" />
          <Tab label="Loan Details" />
          <Tab label="Image" />
          <Tab label="Selfies" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            {currentTab === 0 && <NewEnquiryForm control={control} />}
            {currentTab === 1 && <AddressForm control={control} />}
            {currentTab === 2 && (
              <VerificationForm
                control={control}
                mobileVerified={mobileVerified}
                emailVerified={emailVerified}
                aadharVerified={aadharVerified}
              />
            )}
            {currentTab === 3 && <LoanDetailsForm control={control} />}
            {currentTab === 4 && <ImageForm control={control} />}
            {currentTab === 5 && <SelfieForm control={control} />}

            <Stack direction="row" justifyContent="flex-end" mt={3}>
              <Button type="submit" variant="contained">Save</Button>
            </Stack>
          </form>
        </Box>
      </Card>
    </DashboardContent>
  );
}