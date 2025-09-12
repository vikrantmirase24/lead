import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VerifyView } from 'src/auth/view/verify-view';
// ----------------------------------------------------------------------

const metadata = { title: `Verify otp | ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <VerifyView />
    </>
  );
}
