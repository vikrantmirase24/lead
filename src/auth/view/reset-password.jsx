import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { validToken,resetPassword } from '../context'; 

const ResetPasswordSchema = zod
  .object({
    newPassword: zod.string().min(8, { message: 'Password must be at least 8 characters long!' }),
    confirmPassword: zod.string().min(8, { message: 'Password must be at least 8 characters long!' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match!',
  });
export default function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
  const token = searchParams.get('token');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setErrorMsg('No token provided');
        setIsLoading(false);
        return;
      }
      try {
        const data = await validToken(token); 
         console.log('Token Validation Response:', data);
        if (data.status === 'success') {
          setIsTokenValid(true); 
        } else {
          setErrorMsg(data.message || 'Invalid or expired reset token.');
          router.push(paths.page404);
        }
      } catch (error) {
        console.error('Validation Error:', error);
        setErrorMsg(error.message || 'An error occurred while validating the token.');
        router.push(paths.page404);
      } finally {
        setIsLoading(false); 
      }
    };
    validateToken();
  }, [token,router]);
  const onSubmit = async (data) => {
    const resetToken = new URLSearchParams(window.location.search).get('token');
    try {
      const response = await resetPassword({ resetToken, newPassword: data.newPassword });
      console.log(response);
      setSuccessMsg('Password Updated Successfully');
      setIsPasswordReset(true);
    } catch (error) {
      console.error('Password reset failed:', error);
      setErrorMsg(error.message || 'An error occurred while resetting the password');
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
      padding={3}
    >
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
      {!isPasswordReset ? (
        <>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" gutterBottom>
              Reset Your Password
            </Typography>
            <Typography variant="body2">
              Please enter your new password and confirm it to reset your password.
            </Typography>
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            display="flex"
            flexDirection="column"
            gap={3}
            width="100%"
            maxWidth={400}
          >
            <TextField
              label="New Password"
              type={newPasswordVisible ? 'text' : 'password'}
              {...register('newPassword')}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setNewPasswordVisible(!newPasswordVisible)} edge="end">
                      <Iconify icon={newPasswordVisible ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm Password"
              type={confirmPasswordVisible ? 'text' : 'password'}
              {...register('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} edge="end">
                      <Iconify icon={confirmPasswordVisible ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              fullWidth
            >
              Submit
            </LoadingButton>
          </Box>
        </>
      ) : (
        <Box textAlign="center">
          <Typography variant="h6" gutterBottom>
            Password successfully reset!
          </Typography>
          <Typography variant="body2" mb={2}>
            Your password has been reset successfully. You can now sign in with your new password.
          </Typography>
          <Link
            href={paths.auth.signIn}
            underline="none"
            onClick={() => router.push(paths.auth.signIn)}
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





