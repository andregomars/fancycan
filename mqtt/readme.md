# host mosquitto thur. docker
```bash
docker run -d -p 1883:1883 -p 9001:9001 -v $PWD/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
```
** Must run in Powershell if under Windows
## MQTT test client
- MQTTBox
- [ mqtt-client ](https://github.com/anregomars/mqtt-client)
## Websocket test tool
- wscat (npm)

