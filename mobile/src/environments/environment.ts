export enum DataSourceType {
    Local,
    Firebase,
}

export const environment = {
    production: false,
    firebase: {
        apiKey: 'xxx',
        authDomain: 'xxx',
        databaseURL: 'https://fancycandemo.firebaseio.com',
        projectId: 'fancycandemo',
        storageBucket: 'xxx',
        messagingSenderId: 'xxx'
    },
    loadMap: false,
    dataSource: DataSourceType.Local
}