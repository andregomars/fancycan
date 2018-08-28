export enum DataSourceType {
  Local,
  Firebase,
}

export const environment = {
  production: true,
  agm: { apiKey: 'AIzaSyCjplxp6Vku_R6LtWskqd0K7tSb0wLISPY' },
  firebase: {
    apiKey: '',
    authDomain: 'xxx.firebaseapp.com',
    databaseURL: 'https://xxx.firebaseio.com',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  },
  apiRootLocal: 'assets/data',
  reportFallbackMonths: 3,
  delayEmulatorTimer: 2000,
  dataSource: DataSourceType.Local
};

