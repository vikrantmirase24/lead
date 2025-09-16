// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',

  page603: '/error/603',
  page604: '/error/604',
  page600: '/error/600',
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    verify: `${ROOTS.AUTH}/verify`,
    forgot_password: `${ROOTS.AUTH}/forgot-password`,
    reset_password: `${ROOTS.AUTH}/reset-password`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,

    productlist: `${ROOTS.DASHBOARD}/product/list`,
    productadd: `${ROOTS.DASHBOARD}/product/add`,
    productedit: (id) => `${ROOTS.DASHBOARD}/product/edit/${id}`,

    natureBusinesslist: `${ROOTS.DASHBOARD}/nature-business/list`,
    natureBusinessadd: `${ROOTS.DASHBOARD}/nature-business/add`,
    natureBusinessedit: (id) => `${ROOTS.DASHBOARD}/nature-business/edit/${id}`,

    propertylist: `${ROOTS.DASHBOARD}/property/list`,
    propertyadd: `${ROOTS.DASHBOARD}/property/add`,
    propertyedit: (id) => `${ROOTS.DASHBOARD}/property/edit/${id}`,

    loanamtlist: `${ROOTS.DASHBOARD}/loan-amount/list`,
    loanamtadd: `${ROOTS.DASHBOARD}/loan-amount/add`,
    loanamtedit: (id) => `${ROOTS.DASHBOARD}/loan-amount/edit/${id}`,

    propetyDocumentlist: `${ROOTS.DASHBOARD}/property-document/list`,
    propetyDocumentadd: `${ROOTS.DASHBOARD}/property-document/add`,
    propetyDocumentedit: (id) => `${ROOTS.DASHBOARD}/property-document/edit/${id}`,  

    alleledslist: `${ROOTS.DASHBOARD}/all-leads/list`,
    activeledslist: `${ROOTS.DASHBOARD}/active-leads/list`,
    closeledslist: `${ROOTS.DASHBOARD}/close-leads/list`,
    todayledslist: `${ROOTS.DASHBOARD}/today-leads/list`,
    todayfollowuplist: `${ROOTS.DASHBOARD}/today-followup/list`,
    monthledslist: `${ROOTS.DASHBOARD}/lead-month/list`,
    refferedlist: `${ROOTS.DASHBOARD}/reffered/list`,

    Allleadview: (id) => `${ROOTS.DASHBOARD}/leads-view/view/${id}`,
    ticketview: `${ROOTS.DASHBOARD}/ticket/view`,
    TicketViewByid: (id) => `${ROOTS.DASHBOARD}/ticket-view/view/${id}`,

    reportlistview: `${ROOTS.DASHBOARD}/report-list/view`,

    enduselistview: `${ROOTS.DASHBOARD}/end-use-list/view`,
    enduseadd: `${ROOTS.DASHBOARD}/end-use-add/add`,
    enduseedit: (id) => `${ROOTS.DASHBOARD}/end-use-edit/edit/${id}`,

    incompleteTodayLead: `${ROOTS.DASHBOARD}/incomplete-today-lead/view`,
    incompleteTodayLeadEdit: (id) => `${ROOTS.DASHBOARD}/incomplete-today-lead-edit/${id}`,
    incompleteAllLead: `${ROOTS.DASHBOARD}/incomplete-all-lead/view`,
  },
};
