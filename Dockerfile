# Use the official Node.js image
FROM node:20-alpine

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
RUN mkdir -p /usr/src/app/logs && chown -R DiscordBotSupport /usr/src/app/logs

# Switch to the non-root user
USER DiscordBotSupport

# Start the container by first running `npm install` and then starting the application
CMD ["sh", "-c", "npm start"]


# docker volume create discord-bot-logs
# docker build -t discord-bot-support-image .
# docker run -d --name discord-bot-support --env-file .env -v discord-bot-logs:/usr/src/app/logs discord-bot-support-image
