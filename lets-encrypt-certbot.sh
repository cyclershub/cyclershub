# Define your environment variables here
APP_NAME="cyclershub"
DB_CONTAINER_NAME="database"
DB_NAME="main"
DB_USER="main"
DB_PASSWORD="jz@K5HWe%WMKJVhS"
DB_PORT=5432
DB_VOLUME="postgres_data"

# Install snapd
sudo apt install snapd -y;
# Install Certbot
sudo snap install --classic certbot;
sudo ln -s /snap/bin/certbot /usr/bin/certbot;
# Stop the currently running server and start up certbot
docker stop $APP_NAME;
sudo certbot certonly --standalone;
# Test auto-renewal
sudo certbot renew --dry-run;

# Spin the server back up
touch ./.env && echo "PRIVATE_KEY=$(cat /etc/letsencrypt/live/cyclershub.com/privkey.pem | base64 | tr -d '\n')" >> ./.env && echo "CERTIFICATE=$(cat /etc/letsencrypt/live/cyclershub.com/fullchain.pem | base64 | tr -d '\n')" >> ./.env
docker run -d --name $APP_NAME --link $DB_CONTAINER_NAME -p "80:80" -e DB_CONNECTION=postgresql://$DB_USER:$DB_PASSWORD@${DB_CONTAINER_NAME}:$DB_PORT/$DB_NAME -e DB_PORT=$DB_PORT $APP_NAME --env-file ./.env;