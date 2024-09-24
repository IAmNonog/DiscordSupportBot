# SupportBot - Discord Bot

bot discord to manage support using a forum-type channel.  
Allows you to manage tickets concerning issues.

## Features

A "Forum" type Discord channel is used as a support channel. So you can help your users solve their problems. Each new post/thread in this forum is then considered a ticket to be processed.  

- Customizable support role management
- Rename new posts with a ticket ID to make them easier to find.
- Allow support staff to flag a ticket as a duplicate of another, redirecting the user to the original ticket
- Possibility of forcibly closing tickets, or waiting for user confirmation 
- Configurable automatic deletion of inactive tickets.

All configurable options can be found in the .config file, along with comments describing each feature.  


## Install with Docker

### Before starting

Before you get started, you need to make sure you have Docker installed on your system, and that you're able to run the docker commands :

```bash
docker -v
```

### Clone

- Clone repository :
```bash
git clone https://github.com/IAmNonog/DiscordSupportBot.git
```
```bash
cd DiscordSupportBot
```

### Config the bot

- Create config file
```bash
cp .env.example .env
```

**Fill in the necessary information in the <code>.env</code> file**.  
You must specify your bot discord token there, and your channel and support role support IDs.

- Create configuration file
```bash
cp .config.example .config
```
You can modify the messages sent by the bot, and configure various options in the <code>.config</code> file.  
So this is where you can translate the bot's messages. We recommend you take a look at this file.

### Build the container

```bash
docker build -t discord-bot-support-image .
```

### Start the container

```bash
docker run -d --name discord-bot-support --env-file .env -v $(pwd)/logs:/usr/src/app/logs discord-bot-support-image
```

<br><br><br><br>
# 
## Install without Docker (Legacy)

### Before starting

You need :
- NodeJS v18 and above (with npm)

### Clone
- Clone repository
```bash
git clone https://github.com/IAmNonog/DiscordSupportBot.git
```
```bash
cd DiscordSupportBot
```

- Install dependancies
```bash
npm install
```

- Create config file
```bash
cp .env.example .env
```

**Fill in the necessary information in the <code>.env</code> file**.  
You must specify your bot discord token there, and your channel and support role support IDs.

- Create configuration file
```bash
cp .config.example .config
```
You can modify the messages sent by the bot, and configure various options in the <code>.config</code> file.  

So this is where you can translate the bot's messages. We recommend you take a look at this file


### Deploy Commands


- Deploy for prod :
```bash
node deploy-commands.js
```

### Start the bot
```bash
node bot.js
```

