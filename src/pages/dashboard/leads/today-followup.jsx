import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TodayFollowupLeadsView } from 'src/sections/leads/today-followup';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <TodayFollowupLeadsView />
        </>
    );
}
