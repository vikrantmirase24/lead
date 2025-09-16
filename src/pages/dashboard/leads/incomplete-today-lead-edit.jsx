import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import EditIncompleteLeadPage from 'src/sections/leads/incomplete-today-lead-edit';
// ----------------------------------------------------------------------

const metadata = { title: `User View | Dashboard - ${CONFIG.appName}` };

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {metadata.title}</title>
            </Helmet>

            <EditIncompleteLeadPage />
        </>
    );
}
