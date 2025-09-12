import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LeadsListView } from 'src/sections/leads/all-leads-view';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <LeadsListView />
    </>
  );
}
