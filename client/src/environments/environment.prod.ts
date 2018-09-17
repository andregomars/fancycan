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
  apiRootLocal: 'assets/data',
  reportFallbackMonths: 3,
  delayEmulatorTimer: 2000,
  loadMap: true,
  dataSource: DataSourceType.Firebase
};

