# host mosquitto thur. docker (using docker-compose instead!!!)
```bash
docker run -d -p 1883:1883 -p 9001:9001 -v $PWD/mosquitto.conf:/mosquitto/config/mosquitto.conf -v $PWD/ssl/:/mosquitto/ssl/ eclipse-mosquitto
```
** Must run in Powershell if under Windows.

** Reset credential if launch failed due to file or folder path issue under Windows. (Docker icon > Settings > Shared Drive)

** mqtt://localhost:1883  (non-ssl)

** wss://localhost:9001   (ssl)
## MQTT test client
- MQTTBox
- [ mqtt-client ](https://github.com/anregomars/mqtt-client)
## Websocket test tool
- wscat (npm)
## Generate CA signed certificate and key
1. Make CA key and cert
```bash
openssl req -subj "//CN=mqtt authority\OU=ca.mqtt.com\O=mqtt ca ltd.\L=CHH\ST=CA\C=US" -new -days 3650 -nodes -x509 -keyout mqtt_ca.key -out mqtt_ca.crt
```
2. Make server key and cert request 
```bash
openssl req -nodes -newkey rsa:2048 -keyout mqtt_srv.key -out mqtt_srv.csr -subj "//CN=mqtt server\OU=srv.mqtt.com\O=mqtt server ltd.\L=CHH\ST=CA\C=US" 
```
3. Make server cert and signed through CA cert & key.
```bash
openssl x509 -req -in mqtt_srv.csr -CA mqtt_ca.crt -CAkey mqtt_ca.key -CAcreateserial -out mqtt_srv.crt -days 3650
```

