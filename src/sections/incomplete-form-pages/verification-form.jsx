import { useState } from 'react';
import { Stack, TextField, Button, InputAdornment } from '@mui/material';
import { Controller, useWatch } from 'react-hook-form';

export function VerificationForm({ control, mobileVerified, emailVerified, aadharVerified }) {
  const mobileNumber = useWatch({ control, name: 'mobileNumber' });
  const email = useWatch({ control, name: 'email' });
  const aadhar = useWatch({ control, name: 'aadhar' });

  // only for showing OTP inputs after "Send OTP"
  const [otpState, setOtpState] = useState({
    mobile: false,
    email: false,
    aadhar: false,
  });

  // Simple email validation
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  // Handlers
  const handleSendOtp = (type) => setOtpState((prev) => ({ ...prev, [type]: true }));
  const handleResendOtp = (type) => alert(`${type} OTP Resent`);
  const handleSkipOtp = (type) => alert(`${type} OTP Skipped`);

  const handleVerify = (type) => {
    alert(`${type} Verified!`);
    setOtpState((prev) => ({ ...prev, [type]: false }));
    // ideally call API + update parent verified flag here
  };

  return (
    <Stack spacing={4}>
      {/* Mobile */}
      <Stack spacing={2}>
        <Controller
          name="mobileNumber"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Mobile Number"
              fullWidth
              disabled={mobileVerified}
              inputProps={{ maxLength: 10, inputMode: 'numeric', pattern: '[0-9]*' }}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) field.onChange(value);
              }}
              InputProps={{
                endAdornment: mobileVerified && (
                  <InputAdornment position="end">
                    <span style={{ color: "green", fontSize: "14px", fontWeight: 600 }}>
                      ✓ Verified
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {!mobileVerified && !otpState.mobile && mobileNumber?.length === 10 && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => handleSendOtp('mobile')}>Send OTP</Button>
            <Button variant="outlined" onClick={() => handleSkipOtp('mobile')}>Skip OTP</Button>
          </Stack>
        )}

        {!mobileVerified && otpState.mobile && (
          <>
            <Controller
              name="mobileOtp"
              control={control}
              render={({ field }) => <TextField {...field} label="Enter Mobile OTP" fullWidth />}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" onClick={() => handleVerify('mobile')}>Verify</Button>
              <Button variant="outlined" onClick={() => handleResendOtp('Mobile')}>Resend OTP</Button>
            </Stack>
          </>
        )}
      </Stack>

      {/* Email */}
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
              disabled={emailVerified}
              InputProps={{
                endAdornment: emailVerified && (
                  <InputAdornment position="end">
                    <span style={{ color: "green", fontSize: "14px", fontWeight: 600 }}>
                      ✓ Verified
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {!emailVerified && !otpState.email && isValidEmail(email) && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => handleSendOtp('email')}>Send OTP</Button>
            <Button variant="outlined" onClick={() => handleSkipOtp('email')}>Skip OTP</Button>
          </Stack>
        )}

        {!emailVerified && otpState.email && (
          <>
            <Controller
              name="emailOtp"
              control={control}
              render={({ field }) => <TextField {...field} label="Enter Email OTP" fullWidth />}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" onClick={() => handleVerify('email')}>Verify</Button>
              <Button variant="outlined" onClick={() => handleResendOtp('Email')}>Resend OTP</Button>
            </Stack>
          </>
        )}
      </Stack>

      {/* Aadhaar */}
      <Stack spacing={2}>
        <Controller
          name="aadhar"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Aadhaar Number"
              fullWidth
              disabled={aadharVerified}
              inputProps={{ maxLength: 12, inputMode: 'numeric', pattern: '[0-9]*' }}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 12) field.onChange(value);
              }}
              InputProps={{
                endAdornment: aadharVerified && (
                  <InputAdornment position="end">
                    <span style={{ color: "green", fontSize: "14px", fontWeight: 600 }}>
                      ✓ Verified
                    </span>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {!aadharVerified && !otpState.aadhar && aadhar?.length === 12 && (
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => handleSendOtp('aadhar')}>Send OTP</Button>
            <Button variant="outlined" onClick={() => handleSkipOtp('aadhar')}>Skip OTP</Button>
          </Stack>
        )}

        {!aadharVerified && otpState.aadhar && (
          <>
            <Controller
              name="aadharOtp"
              control={control}
              render={({ field }) => <TextField {...field} label="Enter Aadhaar OTP" fullWidth />}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" color="success" onClick={() => handleVerify('aadhar')}>Verify</Button>
              <Button variant="outlined" onClick={() => handleResendOtp('Aadhar')}>Resend OTP</Button>
            </Stack>
          </>
        )}
      </Stack>
    </Stack>
  );
}
