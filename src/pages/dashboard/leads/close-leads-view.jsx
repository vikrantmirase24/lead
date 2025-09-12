import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ClosedLeadsListView } from 'src/sections/leads/close-leads-view';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <ClosedLeadsListView />
        </>
    );
}
