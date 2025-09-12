import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LeadViewPage } from 'src/sections/lead-data/lead-view';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadViewPage />
    </>
  );
}
