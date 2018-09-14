export const navItems = [
  {
    name: 'Fleet',
    url: '/fleet',
    icon: 'fa fa-home'
  },
  {
    name: 'Vehicle',
    url: '/vehicle',
    icon: 'fa fa-bus',
    children: [
      {
        name: 'Realtime Monitor',
        url: '/vehicle/rtm',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Playback',
        url: '/vehicle/playback',
        icon: 'fa fa-angle-right'
      }
    ]
  },
  {
    name: 'Statistic',
    icon: 'fa fa-area-chart',
    children: [
      {
        name: 'Fleet Malfunction',
        url: '/statistic/malfunction/fleet',
        icon: 'fa fa-flag'
      }
    ]
  }
];
