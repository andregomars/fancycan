export enum DataSourceType {
  Local,
  Firebase,
}

export const environment = {
  production: true,
  agm: { apiKey: 'AIzaSyCjplxp6Vku_R6LtWskqd0K7tSb0wLISPY' },
  firebase: {
    apiKey: 'xxx',
    authDomain: 'xxx',
    databaseURL: 'https://fancycandemo.firebaseio.com',
    projectId: 'xxx',
    storageBucket: 'xxx',
    messagingSenderId: 'xxx'
  },
  mongodbAPI: {
    url: 'http://52.32.76.180:8080',
    database: 'main',
    authToken: 'Basic YWRtaW46Y2hhbmdlaXQ='
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

