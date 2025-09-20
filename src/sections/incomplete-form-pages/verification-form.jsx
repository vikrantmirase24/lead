import { useState, useEffect } from 'react';
import { Stack, TextField, Button, InputAdornment } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios';

export function VerificationForm({ control, leadId, userId, mobileVerified, emailVerified, aadharVerified }) {
  const mobileNumber = useWatch({ control, name: 'mobileNumber' });
  const email = useWatch({ control, name: 'email' });
  const aadhar = useWatch({ control, name: 'aadhar' });

  const [verified, setVerified] = useState({
    mobile: mobileVerified || false,
    email: emailVerified || false,
    aadhar: aadharVerified || false,
  });

  useEffect(() => {
    setVerified({
      mobile: mobileVerified || false,
      email: emailVerified || false,
      aadhar: aadharVerified || false,
    });
  }, [mobileVerified, emailVerified, aadharVerified]);

  const [otpState, setOtpState] = useState({ mobile: false, email: false, aadhar: false });
  const [requestIds, setRequestIds] = useState({ mobile: null, email: null, aadhar: null });

  const handleSendOtp = async (type, value) => {
    try {
      const res = await axiosInstance.post(endpoints.user.verification(leadId), {
        channel: type,
        value,
      });
      setRequestIds((prev) => ({ ...prev, [type]: res.data.request_id }));
      setOtpState((prev) => ({ ...prev, [type]: true }));
    } catch (err) {
      console.error(err);
      alert(`Failed to send OTP for ${type}`);
    }
  };

  const handleVerify = async (type, otp, value) => {
    try {
      const res = await axiosInstance.post(endpoints.user.otpVerify(leadId), {
        user_id: userId,
        request_id: requestIds[type],
        otp_code: otp,
        channel: type,
        value,
      });
      if (res.data.success) {
        setVerified((prev) => ({ ...prev, [type]: true }));
        setOtpState((prev) => ({ ...prev, [type]: false }));
      } else {
        alert(`${type} OTP verification failed`);
      }
    } catch (err) {
      console.error(err);
      alert(`${type} OTP verification failed`);
    }
  };

  const handleCompleteVerification = async () => {
    try {
      await axiosInstance.post(endpoints.user.completeVerification(leadId), {
        mobile: mobileNumber,
        email,
        aadhaar: aadhar,
        mobile_verified: verified.mobile,
        email_verified: verified.email,
        aadhaar_verified: verified.aadhar,
      });
      alert('✅ Verification Complete');
    } catch (err) {
      console.error(err);
      alert('Failed to complete verification');
    }
  };


  return (
    <Stack spacing={4}>
      <Stack spacing={2}>
        <Controller
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile Number"
              fullWidth
              disabled={verified.mobile}
              InputProps={{
                endAdornment: verified.mobile && (
                  <InputAdornment position="end">
                    <span style={{ color: 'green', fontWeight: 600 }}>✓ Verified</span>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {!verified.mobile && !otpState.mobile && mobileNumber?.length === 10 && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => handleSendOtp('mobile', mobileNumber)}>
              Send OTP
            </Button>
          </Stack>
        )}
        {!verified.mobile && otpState.mobile && (
          <>
            <Controller
              name="mobileOtp"
              control={control}
              render={({ field }) => <TextField {...field} label="Enter Mobile OTP" fullWidth />}
            />
            <Button
              variant="contained"
              onClick={() => handleVerify('mobile', control.getValues('mobileOtp'), mobileNumber)}
            >
              Verify Mobile
            </Button>
          </>
        )}
      </Stack>

      <Stack spacing={2}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              fullWidth
              disabled={verified.email}
              InputProps={{
                endAdornment: verified.email && (
                  <InputAdornment position="end">
                    <span style={{ color: 'green', fontWeight: 600 }}>✓ Verified</span>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {!verified.email && !otpState.email && email && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => handleSendOtp('email', email)}>
              Send OTP
            </Button>
          </Stack>
        )}
        {!verified.email && otpState.email && (
          <>
            <Controller
              name="emailOtp"
              control={control}
              render={({ field }) => <TextField {...field} label="Enter Email OTP" fullWidth />}
            />
            <Button
              variant="contained"
              onClick={() => handleVerify('email', control.getValues('emailOtp'), email)}
            >
              Verify Email
            </Button>
          </>
        )}
      </Stack>

      <Stack spacing={2}>
        <Controller
          name="aadhar"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Aadhaar Number"
              fullWidth
              disabled={verified.aadhar}
              InputProps={{
                endAdornment: verified.aadhar && (
                  <InputAdornment position="end">
                    <span style={{ color: 'green', fontWeight: 600 }}>✓ Verified</span>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        {!verified.aadhar && !otpState.aadhar && aadhar?.length === 12 && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => handleSendOtp('aadhar', aadhar)}>
              Send OTP
            </Button>
          </Stack>
        )}
        {!verified.aadhar && otpState.aadhar && (
          <>
            <Controller
              name="aadharOtp"
              control={control}
              render={({ field }) => <TextField {...field} label="Enter Aadhaar OTP" fullWidth />}
            />
            <Button
              variant="contained"
              onClick={() => handleVerify('aadhar', control.getValues('aadharOtp'), aadhar)}
            >
              Verify Aadhaar
            </Button>
          </>
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" color="success" onClick={handleCompleteVerification}>
          Complete Verification
        </Button>
      </Stack>
    </Stack>
  );
}
