import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import TodayLeadsIncomplete from 'src/sections/leads/incomplete-today-lead';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <TodayLeadsIncomplete />
        </>
    );
}
