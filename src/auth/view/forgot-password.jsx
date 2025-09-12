import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';

import { Form, Field } from 'src/components/hook-form';

import { forgotPassword } from '../context';

const isEmailOrMobile = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;
  return emailRegex.test(value) || mobileRegex.test(value);
};
// Schema for validation
const ResetPasswordSchema = zod.object({
  userName: zod.string().min(1, { message: 'Email is required!' }).refine(isEmailOrMobile, {
      message: 'Username must be a valid email address or a 10-digit mobile number!',
    }),
});
export function ForgotPasswordView() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const defaultValues = {
    userName: '',
  };
  const [isEmailSent, setIsEmailSent] = useState(false);
  const methods = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = handleSubmit(async (data) => {
    console.log('ddd:',data);
    try {
      await forgotPassword({userName:data.userName});
      setIsEmailSent(true); 
      setSuccessMsg('Link send Succesfully');
    } catch (error) {
      console.error('ttt:',error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      padding={5}
    >
      {/* Header Section */}
      <Box textAlign="center" mb={4}>
        <PasswordIcon style={{ fontSize: 40, marginBottom: 16 }} />
        <Typography variant="h4" gutterBottom>
          Forgot your password?
        </Typography>
        <Typography variant="body2">
        A password reset link has been sent to your registered email and mobile number. Please check your inbox or SMS to proceed with resetting your password.
        </Typography>
      </Box>
      {/* Form Section */}
      {!isEmailSent ? (
        <Form methods={methods} onSubmit={onSubmit}>
          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}
          {!!successMsg && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {successMsg}
                  </Alert>
                )}
          
            <Field.Text sx={{ mb: 2 }}
              name="userName"
              label="User Name"
              placeholder="example@gmail.com"
              InputProps={{
                sx: {
                  width: '100%', 
                },
              }}
            />
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Sending..."
            >
              Send request
            </LoadingButton>
          
        </Form>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Reset email sent!
          </Typography>
          <Typography variant="body2" mb={2}>
            Please check your inbox for a link to reset your password.
          </Typography>
          <Link
            href={paths.auth.signIn}
            underline="none"
            onClick={() => router.push(paths.auth.signIn)} // Replace with your sign-in route
            variant="body2"
            color="primary"
          >
            Return to Sign In
          </Link>
        </Box>
      )}
    </Box>
  );
}