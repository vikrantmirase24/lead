import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EditPropertyDocumentView } from 'src/sections/property-document/edit';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EditPropertyDocumentView />
    </>
  );
}
