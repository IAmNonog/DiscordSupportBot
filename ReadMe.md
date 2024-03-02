# EchoVerse - Discord Bot

bot discord to manage support using a forum-type channel.  
Allows you to manage tickets concerning issues.

## Install

### What do you need

- NodeJS (with npm)

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
Fill in the necessary information in the <code>.env</code> file

### Deploy Commands

- Deploy for dev & tests (only in your server) :
```bash
node deploy-commands-dev.js
```
- Deploy for prod (all servers) :
```bash
node deploy-commands.js
```

### Start the bot
```bash
node bot.js
```
