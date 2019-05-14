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
    mongodbAPI: {
        // url: 'http://localhost:8080',
        url: 'https://api.fancycan.com/rest',
        database: 'main',
        authToken: 'Basic YWRtaW46Y2hhbmdlaXQ='
    },
    loadMap: false,
    defaultFleetCode: 'BYD',
    dataSource: DataSourceType.Local
}