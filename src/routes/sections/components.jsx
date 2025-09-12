import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('src/pages/components'));

// Foundation
const GridPage = lazy(() => import('src/pages/components/foundation/grid'));
const IconsPage = lazy(() => import('src/pages/components/foundation/icons'));
const ColorsPage = lazy(() => import('src/pages/components/foundation/colors'));
const ShadowsPage = lazy(() => import('src/pages/components/foundation/shadows'));
const TypographyPage = lazy(() => import('src/pages/components/foundation/typography'));

export const componentsRoutes = [
  {
    element: <Suspense fallback={<SplashScreen />}>{}</Suspense>,
    children: [
      {
        path: 'components',
        children: [
          { element: <IndexPage />, index: true },
          {
            path: 'foundation',
            children: [
              {
                element: <Navigate to="/components/foundation/colors" replace />,
                index: true,
              },
              { path: 'grid', element: <GridPage /> },
              { path: 'icons', element: <IconsPage /> },
              { path: 'colors', element: <ColorsPage /> },
              { path: 'shadows', element: <ShadowsPage /> },
              { path: 'typography', element: <TypographyPage /> },
            ],
          },
          {
            path: 'mui',
            children: [
              {
                element: <Navigate to="/components/mui/accordion" replace />,
                index: true,
              },
            ],
          },
          {
            path: 'extra',
            children: [],
          },
        ],
      },
    ],
  },
];
