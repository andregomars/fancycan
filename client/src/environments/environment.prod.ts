export enum DataSourceType {
  Local,
  Firebase,
}

export const environment = {
  production: true,
  agm: { apiKey: 'AIzaSyCjplxp6Vku_R6LtWskqd0K7tSb0wLISPY' },
  firebase: {
    apiKey: 'AIzaSyCjplxp6Vku_R6LtWskqd0K7tSb0wLISPY',
    authDomain: 'fancycandemo.firebaseapp.com',
    databaseURL: 'https://fancycandemo.firebaseio.com',
    projectId: 'fancycandemo',
    storageBucket: 'fancycandemo.appspot.com',
    messagingSenderId: '459557828534'
  },
  mqtt: {
    connectOnCreate: false,
    protocol: 'wss',
    hostname: 'app.fancycan.com',
    path: '/mqtt',
    port: 9001
  },
  rtmMessagesMaxCount: 20,
  topic: 'tCan',
  apiRootLocal: 'assets/data',
  reportFallbackMonths: 3,
  delayEmulatorTimer: 2000,
  loadMap: true,
  dataSource: DataSourceType.Firebase
};

