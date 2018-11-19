import shortid from 'shortid';
import net from 'net';
import fs from 'fs';

export class Application {
    public static start() {
        const dir = './output';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const tcpServer = net.createServer();
        tcpServer.on('connection', (socket) => {
            console.log('start connection');
            console.log(socket.remoteAddress!);

            try {
                socket.on('data', (data) => {
                    fs.writeFile(`${dir}/data-${shortid.generate()}.bin`, data, (error) => {
                        if (error) {
                            throw error;
                        }
                        console.log('data written');
                    });
                });
            } catch (error) {
                console.log(error);
            }
        });

        tcpServer.listen(5888);
    }

}
