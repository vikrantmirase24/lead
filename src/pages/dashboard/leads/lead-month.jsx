import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MonthLeadsListView } from 'src/sections/leads/leads-month';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <MonthLeadsListView />
        </>
    );
}
