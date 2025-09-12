import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EndUseListView } from 'src/sections/end-use/end-use-list';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <EndUseListView />
    </>
  );
}
