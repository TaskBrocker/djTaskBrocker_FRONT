import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/tb/',
      //element: <Navigate to="/dashboard/one" replace />,
      element: <Navigate to="/tb/dashboard/tasklist" replace />,
    },
    {
      path: '/tb/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/tb/dashboard/monitor" replace />, index: true },
        { path: 'monitor', element: <PageMonitor /> },
        { path: 'tasklist', element: <TaskList /> },
        { path: 'taskelement', element: <TaskElement /> },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/tb/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/tb/404" replace /> },
  ]);
}

// Dashboard
const PageMonitor = Loadable(lazy(() => import('../pages/PageMonitor')));
const TaskList = Loadable(lazy(() => import('../pages/task/TaskList')));
const TaskElement = Loadable(lazy(() => import('../pages/task/TaskElement')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));