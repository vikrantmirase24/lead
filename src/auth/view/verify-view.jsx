import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useCountdownSeconds } from 'src/hooks/use-countdown';

import { decryptValue } from 'src/utils/crypto';

import { Form, Field } from 'src/components/hook-form';

import { confirmOtpSignUp, resendSignUpCode } from '../context';

export const VerifySchema = zod.object({
  code: zod
    .string()
    .min(1, { message: 'Code is required!' })
    .min(6, { message: 'Code must be at least 6 characters!' }),
});

export function VerifyView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = decryptValue(searchParams.get('user'));
  const portal = decryptValue(searchParams.get('portal'));
  const requestId = decryptValue(searchParams.get('request_id'));
  const countdown = useCountdownSeconds(30);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const defaultValues = { code: '', userId: user, portalId: Number(import.meta.env.VITE_PORTAL_LEAD_ID || portal) };
  const [progress, setProgress] = useState(100);
  const [resendButtonDisabled, setResendButtonDisabled] = useState(true);
  const [verifyButtonDisabled, setVerifyButtonDisabled] = useState(true);

  useEffect(() => {
    if (!user || !portal) {
      router.push(paths.auth.signIn);
    }
    countdown.start();
    const timer = setInterval(() => {
      const remainingPercentage = (countdown.value / 30) * 100;
      setProgress(remainingPercentage);
      if (countdown.value <= 0) {
        setResendButtonDisabled(false);
        setVerifyButtonDisabled(true);
      } else {
        setVerifyButtonDisabled(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, countdown.value, user, portal, router]);

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await confirmOtpSignUp({
        userId: user,
        portalId: Number(import.meta.env.VITE_PORTAL_LEAD_ID),
        otpCode: data.code,
        requestId,
      });
      router.refresh();
    } catch (error) {
      const status = error?.response?.status;
      let message = '';

      switch (status) {
        case 400:
          message = 'Invalid or expired OTP.';
          break;
        case 404:
          message = 'User not found.';
          break;
        case 500:
          message = 'Internal Server Error. Please try again.';
          break;
        default:
          message = error?.response?.data?.message || 'Invalid or expired OTP. Please try again.';
          break;
      }
      console.error('Error confirming sign-up:', error);
      setErrorMsg(message);
      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
    }
  });

  const handleResendCode = useCallback(async () => {
    if (countdown.value <= 0) {
      setResendButtonDisabled(true);
      try {
        countdown.reset();
        countdown.start();
        await resendSignUpCode({ userId: user });
        setSuccessMsg('Otp sent successfully');
        setTimeout(() => { setSuccessMsg(''); }, 3000);
      } catch (error) {
        console.error('Error resending sign-up code:', error);
        setErrorMsg(typeof error === 'string' ? error : error.message);
      }
    }
  }, [countdown, user]);

  return (
    <>
      <Box textAlign="center" mb={3}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={200}
            thickness={8}
            sx={{ color: '#d3d3d3' }}
          />
          <CircularProgress
            variant="determinate"
            value={progress}
            size={200}
            thickness={8}
            sx={{
              color: countdown.value > 0 ? '#4caf50' : '#90ee90',
              position: 'absolute',
              left: 0,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {`${Math.round(countdown.value)}s`}
            </Typography>
          </Box>
        </Box>
        <Typography variant="h5" mb={1}>
          2 Factor Authentication
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We’ve SMS or emailed a 6-digit confirmation code.
          <br />
          Please enter the code in the box below to verify your mobile number or email id.
        </Typography>
      </Box>
      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}
      <Form methods={methods} onSubmit={onSubmit}>
        <Box gap={3} display="flex" flexDirection="column">
          <Field.Code name="code" />
          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            disabled={verifyButtonDisabled}
            loading={isSubmitting}
            loadingIndicator="Verify..."
          >
            Verify
          </LoadingButton>
        </Box>
      </Form>
      <Box mt={2} textAlign="center">
        <Button
          variant="outlined"
          size="small"
          disabled={resendButtonDisabled}
          onClick={handleResendCode}
        >
          Resend Code
        </Button>
      </Box>
      <Box mt={3} textAlign="center">
        <Button variant="text" onClick={() => router.push(paths.auth.signIn)}>
          Return to Sign In
        </Button>
      </Box>
    </>
  );
}