REM use .win file to overwrite default compose file, then spin up
docker-compose -f docker-compose.yml -f docker-compose.win.yml up -d