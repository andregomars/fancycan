# host mosquitto thur. docker
- On Mac / Linux
```bash
docker run -d -p 1883:1883 -p 9001:9001 -v $(pwd)/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
```
- On Windows 
```bash
docker run -d -p 1883:1883 -p 9001:9001 -v ${pwd}/mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
```
## MQTT test client
- MQTTBox
- [ mqtt-client ](https://github.com/anregomars/mqtt-client)
## Websocket test tool
- wscat (npm)

