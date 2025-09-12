import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EditLoanAmountView } from 'src/sections/loan-amount/edit';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EditLoanAmountView />
    </>
  );
}
