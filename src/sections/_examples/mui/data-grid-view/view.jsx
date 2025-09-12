import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DataGridBasic } from './data-grid-basic';
import { DataGridCustom } from './data-grid-custom';
import { ComponentHero } from '../../component-hero';

// ----------------------------------------------------------------------

const _dataGrid = [...Array(20)].map((_, index) => {
  const status =
    (index % 2 && 'online') || (index % 3 && 'alway') || (index % 4 && 'busy') || 'offline';

  return null;
});

// ----------------------------------------------------------------------

export function DataGridView() {
  return (
    <>
      <ComponentHero>
        <CustomBreadcrumbs
          heading="DataGrid"
          links={[{ name: 'Components', href: paths.components }, { name: 'DataGrid' }]}
          moreLink={['https://mui.com/x/react-data-grid/']}
          sx={{ mb: 0 }}
        />

        <Typography variant="body2" sx={{ my: 3 }}>
          This component includes 2 <strong>Free</strong> and <strong>Paid</strong> versions from
          MUI.
          <br />
          Paid version will have more features. Please read more{' '}
          <Link href="https://mui.com/x/react-data-grid/" target="_blank" rel="noopener">
            here
          </Link>
        </Typography>
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack spacing={5}>
          <Card>
            <CardHeader title="Basic" sx={{ mb: 2 }} />
            <Box sx={{ height: 390 }}>
              <DataGridBasic data={_dataGrid} />
            </Box>
          </Card>

          <Card>
            <CardHeader title="Custom" sx={{ mb: 2 }} />
            <Box sx={{ height: 720 }}>
              <DataGridCustom data={_dataGrid} />
            </Box>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
