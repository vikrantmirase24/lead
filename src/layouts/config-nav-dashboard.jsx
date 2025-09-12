import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  user: icon('ic-user'),
  reports:icon('ic-file'),
  calendar: icon('ic-calendar'),
  menuItem: icon('ic-menu-item'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Dashboard',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Management',
    items: [
      {
        title: 'Master',
        path: paths.dashboard.root,
        icon: ICONS.user,
        children: [
          { title: 'Product Type', path: paths.dashboard.productlist },
          { title: 'Nature of Business', path: paths.dashboard.natureBusinesslist },
          { title: 'Property Type', path: paths.dashboard.propertylist },
          { title: 'Loan Amount', path: paths.dashboard.loanamtlist },
          { title: 'Property Document', path: paths.dashboard.propetyDocumentlist },
          { title: 'End Use', path: paths.dashboard.enduselistview },
        ],
      },
      {
        title: 'Leads',
        path: paths.dashboard.root,
        icon: ICONS.user,
        children: [
          { title: 'All Leads', path: paths.dashboard.alleledslist },
          { title: 'Active Leads', path: paths.dashboard.activeledslist },
          { title: 'Closed Leads', path: paths.dashboard.closeledslist },
          { title: 'Today FollowUp', path: paths.dashboard.todayfollowuplist },
          { title: 'Today Leads', path: paths.dashboard.todayledslist },
          { title: 'Leads In Month', path: paths.dashboard.monthledslist },
          { title: 'Referred', path: paths.dashboard.refferedlist },
          { title: 'Tickets', path: paths.dashboard.ticketview },
          { title: 'Reports', path: paths.dashboard.reportlistview },
          { title: 'Incomplete Today Leads', path: paths.dashboard.incompleteTodayLead },
          { title: 'Incomplete All Leads', path: paths.dashboard.incompleteAllLead },
        ],
      },
    ],
  },
];
