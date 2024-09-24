# Use the official Node.js image
FROM node:20-alpine

# Install crond
# TODO : RUN apk add --no-cache bash curl cronie

# Create a non-root user
RUN adduser -S DiscordBotSupport

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Adjust permissions for the logs directory at runtime
RUN mkdir /usr/src/app/logs && chmod 775 /usr/src/app/logs

# Switch to the non-root user
USER DiscordBotSupport

# Start the container by first running `npm install` and then starting the application
# TODO CMD ["sh", "-c", "crond -p /tmp/crond.pid && node ."]
CMD ["sh", "-c", "node ."]

# docker build -t discord-bot-support-image .
# docker run -d --name discord-bot-support --env-file .env -v $(pwd)/logs:/usr/src/app/logs discord-bot-support-image
