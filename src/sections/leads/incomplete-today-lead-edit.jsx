import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { Card, Tabs, Tab, Box, Stack, Button, Alert } from '@mui/material';
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
  const [err, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const { control, handleSubmit, reset, getValues } = useForm({
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
      mobileNumber: '',
      email: '',
      aadhar: '',
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

      mobileVerified: false,
      emailVerified: false,
      aadharVerified: false,
    },
  });

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const response = await axiosInstance.get(endpoints.user.leadgetbyid(id));
        const lead = response.data.data;
        const address = lead.enquiry_addresses?.length > 0 ? lead.enquiry_addresses[0] : {};
        const loan = lead.enquiry_loan_details?.[0] || {};
        const img = lead.enquiry_images?.[0] || {};

        const mappedData = {
          // --- New Enquiry ---
          customerName: lead.name || '',
          mobile: lead.mobile_number || '',
          occupationType: lead.occupation ? Number(lead.occupation) : null,
          employerName: lead.employer_name || '',
          yearsInService: lead.number_of_years_service || '',
          officialContact: lead.official_contact_number || '',
          natureOfService: lead.nature_of_service || '',
          annualIncome: lead.income || '',
          // --- Business Fields ---
          businessName: lead.business_name || '',
          businessPlace: lead.business_place || '',
          businessContact: lead.business_contact_number || '',
          natureOfBusiness: lead.nature_of_business || '',

          interested: lead.interested || false,
          kycCollected: lead.kyc_collected || false,
          kycDocument: lead.kyc_document || '',
          kycNumber: lead.kyc_number || '',

          // --- Normal Address ---
          premisesType: address.premises_type || '',
          premisesStatus: address.premises_status || '',
          address: address.address || '',
          pincode: address.pincode || '',
          latitude: address.latitude || '',
          longitude: address.longitude || '',
          state: address.state || '',
          district: address.district || '',
          area: address.area || '',
          useDifferentAddress: address.use_different_address || false,

          // --- Different Address (MUST match form field names) ---
          differentPremisesType: address.different_premises_type || '',
          differentPremisesStatus: address.different_premises_status || '',
          differentAddress: address.different_address || '',
          differentPincode: address.different_pincode || '',
          differentLatitude: address.different_latitude || '',
          differentLongitude: address.different_longitude || '',
          differentState: address.different_state || '',
          differentDistrict: address.different_district || '',
          differentArea: address.different_area || '',

          // --- Verification ---
          // --- Verification ---
          mobileNumber: lead.enquiry_verification?.mobile || '',
          email: lead.enquiry_verification?.email || '',
          aadhar: lead.enquiry_verification?.aadhaar || '',

          // Verified status
          mobileVerified: lead.enquiry_verification?.mobile_status === 1,
          emailVerified: lead.enquiry_verification?.email_status === 1,
          aadharVerified: lead.enquiry_verification?.aadhaar_verified || false,

          loanTypeMaster: loan.loan_type ? Number(loan.loan_type) : null,
          loanAmount: loan.loan_amount_range ?? null,
          loanRequiredOn: loan.loan_required_on ? Number(loan.loan_required_on) : null,
          vehicleRegistration: loan.vehicle_registration_number || '',
          incomeDocument: loan.income_document || '',
          propertyType: loan.property_type ? Number(loan.property_type) : null,
          propertyDocument: loan.property_document_number || '',
          propertyValue: loan.property_value || '',
          followupPickupDate: loan.followup_pickup_date || null,
          endUse: loan.end_user ? Number(loan.end_user) : null,
          enquiryType: loan.enquiry_type ? Number(loan.enquiry_type) : null,
          remark: loan.remark || '',

          docCategory: 'image', // since enquiry_images means document type = image
          imgPremisesType: img.premises_type || '',
          employeeCode: img.employee_code || '',
          imageDate: img.capture_date || '',
          imageTime: img.capture_time || '',
          ipAddress: img.ip_address || '',
          imgLatitude: img.latitude || '',
          imgLongitude: img.longitude || '',
          uploadedFile: img.media_file ? { previewUrl: img.media_file } : null, // 👈 keep preview
        };

        reset(mappedData);
      } catch (error) {
        console.error("Failed to fetch lead:", error);
      }
    };

    if (id) fetchLead();
  }, [id, reset]);

  const handleSave = async (data, pageType) => {
    try {
      if (pageType === 'enquiry') {
        // 🔹 Enquiry Save
        const payload = {
          enquiry_id: id || undefined,
          name: data.customerName,
          mobile_number: data.mobile,
          occupation: data.occupationType,
          employer_name: data.employerName || '',
          business_name: data.businessName || '',
          kyc_document: data.kycDocument,
          kyc_number: data.kycNumber || '',
        };

        await axiosInstance.post(`/api/lead/enquiries/`, payload);
        setSuccessMsg('Enquiry updated successfully!');
      }

      else if (pageType === 'address') {
        // 🔹 Address Save
        const payload = {
          address_line_1: data.addressLine1 || '',
          address_line_2: data.addressLine2 || '',
          city: data.city || '',
          state: data.state || '',
          pincode: data.pincode || '',
          landmark: data.landmark || '',
        };

        await axiosInstance.post(`/api/lead/enquiries/${id}/address/`, payload);
        setSuccessMsg('Address updated successfully!');
      }

      else if (pageType === 'loan') {
        // 🔹 Loan Details Save
        const payload = {
          loan_type: data.loanTypeMaster || '',
          loan_amount: data.loanAmount || '',
          loan_required_on: data.loanRequiredOn || '',
          vehicle_registration: data.vehicleRegistration || '',
          income_document: data.incomeDocument || '',
          property_type: data.propertyType || '',
          property_document: data.propertyDocument || '',
          property_value: data.propertyValue || '',
          followup_pickup_date: data.followupPickupDate || null,
          end_use: data.endUse || '',
          enquiry_type: data.enquiryType || '',
          remark: data.remark || '',
        };

        await axiosInstance.post(`/api/lead/enquiries/${id}/loan_details/`, payload);
        setSuccessMsg('Loan details updated successfully!');
      }

      else if (pageType === 'image') {
        const formData = new FormData();
        formData.append('enquiry', id);
        formData.append('document_types', data.docCategory);
        formData.append('premises_type', data.imgPremisesType);

        if (data.uploadedFile instanceof File) {
          formData.append('media_file', data.uploadedFile);
        }

        await axiosInstance.post(`/api/lead/enquiries/${id}/images/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        setSuccessMsg('Image uploaded successfully!');
      }

      // ✅ Auto-clear success message after 1.5 sec
      setTimeout(() => setSuccessMsg(''), 1500);

    } catch (error) {
      console.error(error);
      setError('Failed to save data!');
      setTimeout(() => setError(''), 1500);
    }
  };

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
      {!!successMsg && <Alert severity="success" sx={{ mb: 3 }}>{successMsg}</Alert>}
      {!!err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

      <Card>
        <Tabs value={currentTab} onChange={(e, v) => setCurrentTab(v)} sx={{ ml: 3 }}>
          <Tab label="New Enquiry" />
          <Tab label="Address" />
          <Tab label="Verification" />
          <Tab label="Loan Details" />
          <Tab label="Image" />
          {/* <Tab label="Selfies" /> */}
        </Tabs>

        <Box sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(handleSave)}>
            {currentTab === 0 && (
              <NewEnquiryForm control={control} getValues={getValues}
                handleSave={handleSave} pageType="enquiry"
              />
            )}
            {currentTab === 1 && (
              <AddressForm control={control} getValues={getValues} handleSave={handleSave}
                pageType="address"
              />
            )}
            {currentTab === 2 && (
              <VerificationForm
                control={control}
                leadId={id}
                userId={id}
                mobileVerified={mobileVerified}
                emailVerified={emailVerified}
                aadharVerified={aadharVerified}
              />
            )}
            {currentTab === 3 &&
              <LoanDetailsForm control={control} getValues={getValues} handleSave={handleSave}
                pageType="loan" />}
            {currentTab === 4 && <ImageForm control={control} enquiryId={id}/>}
            {/* {currentTab === 5 && <SelfieForm control={control} />} */}
          </form>
        </Box>
      </Card>
    </DashboardContent>
  );
}