import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard } from 'src/auth/guard';

const ProductListPage = lazy(() => import('src/pages/dashboard/product-type/list'));
const ProductAddPage = lazy(() => import('src/pages/dashboard/product-type/add'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product-type/edit'));

const NatureBusinessListPage = lazy(() => import('src/pages/dashboard/nature-business/list'));
const NatureBusinessAddPage = lazy(() => import('src/pages/dashboard/nature-business/add'));
const NatureBusinessEditPage = lazy(() => import('src/pages/dashboard/nature-business/edit'));

const PropertyListPage = lazy(() => import('src/pages/dashboard/property-type/list'));
const PropertyAddPage = lazy(() => import('src/pages/dashboard/property-type/add'));
const PropertyEditPage = lazy(() => import('src/pages/dashboard/property-type/edit'));

const LoanAmtListPage = lazy(() => import('src/pages/dashboard/loan-amount/list'));
const LoanAmtAddPage = lazy(() => import('src/pages/dashboard/loan-amount/add'));
const LoanAmtEditPage = lazy(() => import('src/pages/dashboard/loan-amount/edit'));

const PropeydocumnetListPage = lazy(() => import('src/pages/dashboard/property-document/list'));
const PropeydocumnetAddPage = lazy(() => import('src/pages/dashboard/property-document/add'));
const PropeydocumnetEditPage = lazy(() => import('src/pages/dashboard/property-document/edit'));

const AllLeadsListPage = lazy(() => import('src/pages/dashboard/leads/all-leads-view'));
const ActiveLeadsListPage = lazy(() => import('src/pages/dashboard/leads/active-leads-view'));
const CloseLeadsListPage = lazy(() => import('src/pages/dashboard/leads/close-leads-view'));
const TodayLeadsListPage = lazy(() => import('src/pages/dashboard/leads/today-lead'));
const MonthLeadsListPage = lazy(() => import('src/pages/dashboard/leads/lead-month'));
const RefferedListPage = lazy(() => import('src/pages/dashboard/leads/reffered'));
const FollowupListPage = lazy(() => import('src/pages/dashboard/leads/today-followup'));


const AllLeadViewPage = lazy(() => import('src/pages/dashboard/lead-data/leads-view'));
const TicketViewPage = lazy(() => import('src/pages/dashboard/leads/ticket'));
const TicketViewbyIdPage = lazy(() => import('src/pages/dashboard/leads/ticket-view'));

const ReportViewPage = lazy(() => import('src/pages/dashboard/reports/report-list'));

const EndUseViewPage = lazy(() => import('src/pages/dashboard/end-use/end-use-list'));
const EndUseAddPage = lazy(() => import('src/pages/dashboard/end-use/end-use-add'));
const EndUseEditPage = lazy(() => import('src/pages/dashboard/end-use/end-use-edit'));

const IncompleteTodayLeadPage = lazy(() => import('src/pages/dashboard/leads/incomplete-today-lead'));
const IncompleteTodayEditLeadPage = lazy(() => import('src/pages/dashboard/leads/incomplete-today-lead-edit'));

const IncompleteAllLeadPage = lazy(() => import('src/pages/dashboard/leads/incomplete-all-lead'));

// ----------------------------------------------------------------------

// Overview
const IndexPage = lazy(() => import('src/pages/dashboard'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: CONFIG.auth.skip ? <>{layoutContent}</> : <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      { element: <IndexPage />, index: true },
      { path: 'product/list', element: <ProductListPage /> },
      { path: 'product/add', element: <ProductAddPage /> },
      { path: 'product/edit/:id', element: <ProductEditPage /> },

      { path: 'nature-business/list', element: <NatureBusinessListPage /> },
      { path: 'nature-business/add', element: <NatureBusinessAddPage /> },
      { path: 'nature-business/edit/:id', element: <NatureBusinessEditPage /> },

      { path: 'property/list', element: <PropertyListPage /> },
      { path: 'property/add', element: <PropertyAddPage /> },
      { path: 'property/edit/:id', element: <PropertyEditPage /> },

      { path: 'loan-amount/list', element: <LoanAmtListPage /> },
      { path: 'loan-amount/add', element: <LoanAmtAddPage /> },
      { path: 'loan-amount/edit/:id', element: <LoanAmtEditPage /> },

      { path: 'property-document/list', element: <PropeydocumnetListPage /> },
      { path: 'property-document/add', element: <PropeydocumnetAddPage /> },
      { path: 'property-document/edit/:id', element: <PropeydocumnetEditPage /> },

      { path: 'all-leads/list', element: <AllLeadsListPage /> },
      { path: 'active-leads/list', element: <ActiveLeadsListPage /> },
      { path: 'close-leads/list', element: <CloseLeadsListPage /> },
      { path: 'today-leads/list', element: <TodayLeadsListPage /> },
      { path: 'today-followup/list', element: <FollowupListPage /> },
      { path: 'lead-month/list', element: <MonthLeadsListPage /> },
      { path: 'reffered/list', element: <RefferedListPage /> },

      { path: 'leads-view/view/:id', element: <AllLeadViewPage /> },
      { path: 'ticket/view', element: <TicketViewPage /> },
      { path: 'ticket-view/view/:id', element: <TicketViewbyIdPage /> },

      { path: 'report-list/view/', element: <ReportViewPage /> },

      { path: 'end-use-list/view/', element: <EndUseViewPage /> },
      { path: 'end-use-add/add/', element: <EndUseAddPage /> },
      { path: 'end-use-edit/edit/:id', element: <EndUseEditPage /> },

      { path: 'incomplete-today-lead/view/', element: <IncompleteTodayLeadPage /> },
      { path: 'incomplete-today-lead-edit/:id', element: <IncompleteTodayEditLeadPage /> },
  
      { path: 'incomplete-all-lead/view/', element: <IncompleteAllLeadPage /> },
    ],
  },
];

