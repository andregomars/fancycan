export const navItems = [
  {
    name: 'Fleet',
    icon: 'fa fa-home',
    children: [
      {
        name: 'Choose Fleet',
        url: '/fleet/list',
        icon: 'fa fa-angle-right'
      },
    ]
  },
  {
    name: 'Vehicle',
    icon: 'fa fa-bus',
    children: [
      {
        name: 'Choose Vehicle',
        url: '/vehicle/list',
        icon: 'fa fa-angle-right'
      },
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
        name: 'Fleet',
        url: '/statistic/fleet',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Fleet Malfunction',
        url: '/statistic/malfunction/fleet',
        icon: 'fa fa-angle-right'
      }
    ]
  },
  {
    name: 'Setting',
    icon: 'fa fa-gear',
    children: [
      {
        name: 'J1939',
        url: '/setting/j1939',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Proprietary',
        url: '/setting/proprietary',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Definition',
        url: '/setting/definition',
        icon: 'fa fa-angle-right'
      }
    ]
  }
];
