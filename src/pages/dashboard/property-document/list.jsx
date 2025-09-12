import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PropertyDocumentListView } from 'src/sections/property-document/view';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <PropertyDocumentListView />
    </>
  );
}
