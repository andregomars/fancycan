export enum DataSourceType {
  Local,
  Firebase,
}

export const environment = {
  production: false,
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
    url: 'http://localhost:8080',
    // url: 'http://52.32.76.180:8080',
    database: 'main',
    authToken: 'Basic YWRtaW46Y2hhbmdlaXQ='
  },
  mqtt: {
    connectOnCreate: false,
    protocol: 'ws',
    // hostname: '52.32.76.180',
    hostname: 'localhost',
    port: 9001
  },
  rtmMessagesMaxCount: 15,
  dm1SingleCanIDs: ['18FECA00', '18FECA03'],
  dm1MultipleCanIDs: {
    header: ['18ECFF00', '18ECFF03'],
    data: ['18EBFF00', '18EBFF03'],
  },
  topic: 'tCan',
  apiRootLocal: 'assets/data',
  reportFallbackMonths: 3,
  delayEmulatorTimer: 2000,
  loadMap: false,
  dataSource: DataSourceType.Local
};
