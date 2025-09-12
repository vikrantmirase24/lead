import { z as zod } from 'zod';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';

import { useAuthContext } from '../hooks';
import { signInWithPassword } from '../context';
import { FormHead } from '../components/form-head';

// ----------------------------------------------------------------------
const isEmailOrMobile = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;
  return emailRegex.test(value) || mobileRegex.test(value);
};

const SignInSchema = zod.object({
  username: zod.string().min(1, { message: 'Email is required!' }).refine(isEmailOrMobile, {
    message: 'Username must be a valid email address or a 10-digit mobile number!',
  }),
  password: zod
    .string()
    .min(1, { message: 'Password is required!' })
    .min(6, { message: 'Password must be at least 6 characters!' })
    .max(16, { message: 'Password must be at most 16 characters!' }),
  portal_id: zod.string().optional(),
});

// ----------------------------------------------------------------------

function CustomTextField({ name, label, ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <TextField
      fullWidth
      label={label}
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      {...props}
    />
  );
}

export function JwtSignInView() {
  const router = useRouter();
  const password = useBoolean();
  const [errorMsg, setErrorMsg] = useState('');
  const { checkUserSession } = useAuthContext();

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      username: 'superadmin@berarfinance.com',
      password: 'Berar_2025@Admin',
      portal_id: import.meta.env.VITE_PORTAL_LEAD_ID,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({
        username: data.username,
        password: data.password,
        portal_id: import.meta.env.VITE_PORTAL_LEAD_ID
      });

      const userData = await checkUserSession?.();
    } catch (error) {
      const status = error?.response?.data?.status_code || error?.response?.status;

      switch (status) {
        case 400:
          setErrorMsg('Enter a 10-digit mobile number or a valid email address.');
          break;
        case 401:
          setErrorMsg('Incorrect username or password.');
          break;
        case 403:
          setErrorMsg('Forbidden Error.');
          break;
        case 404:
          setErrorMsg('User not found.');
          break;
        case 500:
          setErrorMsg('Internal Server Error, please try again later.');
          break;
        default:
          setErrorMsg('Internal Server Error, please try again later.');
      }
    }
  });

  return (
    <>
      <Box
        component="img"
        src="/logo/logo-full.png"
        sx={{ borderRadius: '8px', width: 270, alignSelf: 'center', marginBottom: 6 }}
      />
      <FormHead title="Sign in to your account" sx={{ textAlign: { xs: 'center', md: 'left' } }} />
      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <Box gap={3} display="flex" flexDirection="column">
            <CustomTextField
              name="username"
              label="Username"
              placeholder="Enter your email ID / mobile number"
              InputLabelProps={{ shrink: true }}
            />

            <Box gap={1.5} display="flex" flexDirection="column">
              <Link
                component={RouterLink}
                href={paths.auth.forgot_password}
                variant="body2"
                color="inherit"
                sx={{ alignSelf: 'flex-end' }}
              >
                Forgot password?
              </Link>

              <CustomTextField
                name="password"
                label="Password"
                placeholder="Enter your password"
                type={password.value ? 'text' : 'password'}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <LoadingButton
              fullWidth
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              loadingIndicator="Signing in..."
            >
              Sign in
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </>
  );
}
