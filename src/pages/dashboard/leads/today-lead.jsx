import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TodayLeadsListView } from 'src/sections/leads/today-list';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <TodayLeadsListView />
        </>
    );
}
