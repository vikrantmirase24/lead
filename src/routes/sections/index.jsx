import { lazy, Suspense } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { DashboardLayout } from 'src/layouts/dashboard';

import { SplashScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

const DashboardPage = lazy(() => import('src/pages/dashboard'));

export function Router() {
  return useRoutes([
    {
      path: '/',
      /**
       * Skip home page
       * element: <Navigate to={CONFIG.auth.redirectPath} replace />,
       */
      element: (
        <Suspense fallback={<SplashScreen />}>
          <AuthGuard>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </AuthGuard>
        </Suspense>
      ),
    },

    // Auth
    ...authRoutes,
    // ...authDemoRoutes,

    // Dashboard
    ...dashboardRoutes,

     // Main
     ...mainRoutes,
     
    // Components
    ...componentsRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
