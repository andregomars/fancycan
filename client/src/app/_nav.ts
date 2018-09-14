export const navItems = [
  {
    name: 'Fleet',
    url: '/fleet',
    icon: 'fa fa-home'
  },
  {
    name: 'Vehicle',
    url: '/vehicle',
    icon: 'fa fa-bus'
  },
  {
    name: 'Statistic',
    icon: 'fa fa-area-chart',
    children: [
      {
        name: 'Fleet Malfunction',
        url: '/statistic/malfunction/fleet/LAMTA',
        icon: 'fa fa-flag'
      }
    ]
  }
];
