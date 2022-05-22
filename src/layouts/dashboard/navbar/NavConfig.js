import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/static/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  analytics: getIcon('ic_analytics'),
  banking: getIcon('ic_banking'),
  blog: getIcon('ic_blog'),
  booking: getIcon('ic_booking'),
  calendar: getIcon('ic_calendar'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  dashboard: getIcon('ic_dashboard'),
  ecommerce: getIcon('ic_ecommerce'),
};

const navConfig = [
  {
    subheader: 'Task brocker',
    items: [
      { title: 'Dashboard', path: '/dashboard/monitor', icon: ICONS.dashboard },
      {
        title: 'Tasks',
        path: '',
        icon: ICONS.booking,
        children: [
          { title: 'list', path: PATH_DASHBOARD.task.list },
          { title: 'create', path: PATH_DASHBOARD.task.createelement },
        ],
      },
    ],
  },
];

export default navConfig;
