import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import ResetPasswordView from 'src/auth/view/reset-password';
// ----------------------------------------------------------------------

const metadata = { title: `Reset Password | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ResetPasswordView />
    </>
  );
}
