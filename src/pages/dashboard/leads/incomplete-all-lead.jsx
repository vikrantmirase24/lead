import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import AllLeadsIncomplete from 'src/sections/leads/incomplete-all-lead';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <AllLeadsIncomplete />
        </>
    );
}
