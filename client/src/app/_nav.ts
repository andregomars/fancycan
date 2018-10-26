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
      {
        name: 'Dashboard',
        url: '/fleet/dashboard',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Statistic',
        url: '/statistic/fleet',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Malfunction',
        url: '/statistic/malfunction/fleet',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Compare',
        url: '/fleet/compare',
        icon: 'fa fa-angle-right'
      }
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
        name: 'Snapshot',
        url: '/vehicle/snapshot',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Realtime Monitor',
        url: '/vehicle/rtm',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Malfunctions',
        url: '/vehicle/malfunctions',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Playback',
        url: '/vehicle/playback',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Statistic',
        url: '/statistic/vehicle',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Malfunction Statistic',
        url: '/statistic/malfunction/vehicle',
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
      },
      {
        name: 'Vehicle',
        url: '/statistic/vehicle',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Vehicle Malfunction',
        url: '/statistic/malfunction/vehicle',
        icon: 'fa fa-angle-right'
      }
    ]
  },
  {
    name: 'Archive',
    url: '/archive',
    icon: 'fa fa-archive'
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
      },
      {
        name: 'Malfunction',
        url: '/setting/malfunction',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Usage',
        url: '/setting/usage',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Template',
        url: '/setting/vehicle-template',
        icon: 'fa fa-angle-right'
      },
      {
        name: 'Fleet',
        url: '/setting/fleet',
        icon: 'fa fa-angle-right'
      }
    ]
  }
];
