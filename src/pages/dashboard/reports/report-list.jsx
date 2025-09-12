import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReportsListView } from 'src/sections/reports/report-list';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <ReportsListView />
    </>
  );
}
