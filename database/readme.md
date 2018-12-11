## Production Preparation

- Install docker local persist plugin
```bash
curl -fsSL https://raw.githubusercontent.com/CWSpear/local-persist/master/scripts/install.sh | sudo bash
```
- Create named volume to change the physical mounted location of mongo data storage
```bash
docker volume create -d local-persist -o mountpoint=/fc_data/mongo --name=vol_mongo
```
\* In windows/mac development environment, run **docker volume create vol_mongo** instead.

## Host docker instances
- Spin up services, include mongodb, mongo express, restheart
```bash
docker-compose up -d
```
\* In windows development environment, run **./dc4win.bat** instead.