export enum DataSourceType {
  Local,
  Firebase,
}

export const environment = {
  production: false,
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
    protocol: 'ws',
    hostname: '52.32.76.180',
    // hostname: 'localhost',
    port: 9001
  },
  rtmMessagesMaxCount: 15,
  topic: 'tCan',
  apiRootLocal: 'assets/data',
  reportFallbackMonths: 3,
  delayEmulatorTimer: 2000,
  loadMap: true,
  dataSource: DataSourceType.Local
};
