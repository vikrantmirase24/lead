import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { AddLoanAmountView } from 'src/sections/loan-amount/add';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <AddLoanAmountView />
    </>
  );
}
