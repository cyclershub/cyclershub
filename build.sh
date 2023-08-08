#!/bin/bash

# Define your environment variables here
APP_NAME="cyclershub";
DB_CONTAINER_NAME="database";
DB_NAME="main";
DB_USER="main";
DB_PASSWORD="kCKF3ZdUIbCPZF7fwREUJLEevSyyZGWbS68vJSZx5ze4W9PyM9ZXHevtGgScnmRu";
DB_PORT=5432;
DB_VOLUME="postgres_data";
NETWORK="cyclershub-network";

npm i -g pnpm;

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
pnpm install
docker stop $APP_NAME
docker rm $APP_NAME
docker build --no-cache -t $APP_NAME .

# SECTION: Startup jobs zu crontab hinzufügen.
# Erstmal den cronfile leeren.
crontab -r;

# Alle builds schlagen fehl wenn die Datenbank nicht da ist, also muss der Container zuerst gebaut werden.
(crontab -l ; echo "@reboot sudo ~/apps/database/build.sh &") | crontab -;
(crontab -l ; echo "@reboot sudo ~/apps/cyclershub/build.sh &") | crontab -;

# Wir legen ein persistent directory an
PERSISTENT_DIR="${HOME}/persistent/cyclershub";
mkdir -p $PERSISTENT_DIR;

# Danach machen wir ein Backup der Datenbank, falls bei der Migration etwas schiefgehen sollte.
BACKUP_FILENAME="$HOME/backups/$(date +"%Y-%m-%d_%H-%M-%S").sql.gz";
docker exec -t $DB_CONTAINER_NAME pg_dumpall -c -U $DB_USER | gzip > $BACKUP_FILENAME


# Wir stoppen die Datenbank und rebuilden das Backup
docker stop $DB_CONTAINER_NAME

# Wir entfernen das "database" Image um Komplikationen vorzusorgen
docker rm $DB_CONTAINER_NAME

# Wir erstellen ein docker volume, damit wir unsere PostgreSQL Daten sichern können.
docker volume rm $DB_VOLUME
docker volume create $DB_VOLUME

docker network rm $NETWORK;
docker network create $NETWORK;

# Und starten einen neuen "database" container.
cd ~/apps/$DB_CONTAINER_NAME
docker build --no-cache -t $DB_CONTAINER_NAME .
docker run -d --name $DB_CONTAINER_NAME --network $NETWORK -e POSTGRES_USER=$DB_USER -e POSTGRES_PASSWORD=$DB_PASSWORD -p "$DB_PORT:5432" -v $DB_VOLUME:/var/lib/postgresql/data $DB_CONTAINER_NAME

# Wir müssen warten bis die Datenbank wieder läuft.
while ! docker exec $DB_CONTAINER_NAME pg_isready -U $DB_USER -h localhost -p $DB_PORT > /dev/null 2>&1; do
    sleep 1
done

# Und wenden das Backup an.
gunzip -c $BACKUP_FILENAME | docker exec -i $DB_CONTAINER_NAME psql -U $DB_USER main

# Alte build strukturen löschen
rm -r ~/apps/$APP_NAME/dist;

# Wir legen einen .env file für unsere letsencrypt keys an.
rm -f ~/apps/$APP_NAME/.env;
touch ~/apps/$APP_NAME/.env && echo "PRIVATE_KEY=$(cat /etc/letsencrypt/live/cyclershub.com/privkey.pem | base64 | tr -d '\n')" >> ~/apps/$APP_NAME/.env && echo "CERTIFICATE=$(cat /etc/letsencrypt/live/cyclershub.com/fullchain.pem | base64 | tr -d '\n')" >> ~/apps/$APP_NAME/.env
# Danach starten wir unsere App wieder.
docker run -d \
	--name $APP_NAME \
	--network $NETWORK \
	-v "${PERSISTENT_DIR}:/persistent" \
	-p "80:80" \
	-p "443:443" \
	-e DB_NAME=$DB_NAME \
	-e DB_PASS=$DB_PASSWORD \
	-e DB_USER=$DB_USER \
	-e DB_PORT=$DB_PORT \
	-e DB_HOST=$DB_CONTAINER_NAME \
	--env-file ~/apps/$APP_NAME/.env $APP_NAME;

# Das Backup lassen wir da, falls irgendwas schief gehen sollte.