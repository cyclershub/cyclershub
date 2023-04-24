#!/bin/bash

# Define your environment variables here
APP_NAME="cyclershub"
DB_CONTAINER_NAME="database"
DB_NAME="main"
DB_USER="main"
DB_PASSWORD="jz@K5HWe%WMKJVhS"
DB_PORT=5432
DB_VOLUME="postgres_data"

git_pull_force() {
	git reset --hard HEAD
	git clean -f -d
	git pull origin main
}

# Zuerst müssen wir sowohl "cyclershub" als auch "database" von GitHub pullen.
cd ~/apps/$APP_NAME
git_pull_force;

cd ~/apps/$DB_CONTAINER_NAME
git_pull_force;

# Dann bauen wir das Docker Image unserer Application
cd ~/apps/$APP_NAME
docker stop $APP_NAME
docker rm $APP_NAME
docker build --no-cache -t $APP_NAME .

# Danach machen wir ein Backup der Datenbank, falls bei der Migration etwas schiefgehen sollte.
cd ~/backups/
BACKUP_FILENAME="$(date +"%Y-%m-%d_%H-%M-%S").sql.gz"
docker exec -t $DB_CONTAINER_NAME pg_dumpall -c -U $DB_USER | gzip > $BACKUP_FILENAME

# Wir stoppen die Datenbank und rebuilden das Backup
docker stop $DB_CONTAINER_NAME

# Wir entfernen das "database" Image um Komplikationen vorzusorgen
docker rm $DB_CONTAINER_NAME

# Wir erstellen ein docker volume, damit wir unsere PostgreSQL Daten sichern können.
docker volume rm $DB_VOLUME
docker volume create $DB_VOLUME

# Und starten einen neuen "database" container.
cd ~/apps/$DB_CONTAINER_NAME
docker build --no-cache -t $DB_CONTAINER_NAME .
docker run -d --name $DB_CONTAINER_NAME -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -p $DB_PORT:5432 -v $DB_VOLUME:/var/lib/postgresql/data $DB_CONTAINER_NAME

# Wir müssen warten bis die Datenbank wieder läuft.
while ! docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER -h localhost -p $DB_PORT > /dev/null 2>&1; do
    sleep 1
done

# Und wenden das Backup an.
gunzip -c $BACKUP_FILENAME | docker exec -i $DB_CONTAINER_NAME psql -U $DB_USER

# Wir legen einen .env file für unsere letsencrypt keys an.
touch ~/apps/$APP_NAME/.env && echo "PRIVATE_KEY=$(cat /etc/letsencrypt/live/cyclershub.com/privkey.pem | base64 | tr -d '\n')" >> ~/apps/$APP_NAME/.env && echo "CERTIFICATE=$(cat /etc/letsencrypt/live/cyclershub.com/fullchain.pem | base64 | tr -d '\n')" >> ~/apps/$APP_NAME/.env
# Danach starten wir unsere App wieder.
docker run -d --name $APP_NAME --link $DB_CONTAINER_NAME -p "80:80" -e DB_CONNECTION=postgresql://$DB_USER:$DB_PASSWORD@${DB_CONTAINER_NAME}:$DB_PORT/$DB_NAME -e DB_PORT=$DB_PORT $APP_NAME --env-file ./.env;

# Das Backup lassen wir da, falls irgendwas schief gehen sollte.