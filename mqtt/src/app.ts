import mosca from 'mosca';

/*
 mqtt://localhost:1883
 ws://localhosot:9001
*/
var moscaSettings = {
    port: 1883,
    http: {
        port: 9001,
        bundle: true,
        static: './'
    }
};

var server = new mosca.Server(moscaSettings);	
server.on('ready', setup);	

// fired when the mqtt server is ready
function setup() {
    // console.log('Mosca server is up and running')
}

server.on('published', (packet, client) => {
    // console.log('recieved: %s', packet.payload);
});

server.on('clientConnected', (client: any) => {
    // console.log('client connected');
});

server.on('clientDisconnected', function (client: any) {
    // console.log('client disconnected');
});
