import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NatureBusinessView } from 'src/sections/nature-business/view';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <NatureBusinessView />
    </>
  );
}
