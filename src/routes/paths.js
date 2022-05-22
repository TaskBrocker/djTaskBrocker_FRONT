// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/tb/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
};

export const PATH_PAGE = {
  page403: '/tb/403',
  page404: '/tb/404',
  page500: '/tb/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  task: {
    createelement: path(ROOTS_DASHBOARD, '/taskelement'),
    list: path(ROOTS_DASHBOARD, '/tasklist'),
  },
};

export const PATH_DOCS = '';
