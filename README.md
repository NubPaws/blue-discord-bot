# Blue Discord Bot

This is a (mainly music) Discord bot I built specifically for my servers to play music and help me manage the server. The bot is a work in progress how ever the bot works.

Feel free to use this projects and extend on it.

*Note.* This project is a side project, and as side projects are, you can expect this project to go through vast changes. Music functionality will stay the same (or get enhanced, but not reduced), but the code will change. So if you are dependent on the music funcitonality you can safely use this bot (as long as it's dependencies are okay).

## Setup

### The easiest method (with Docker)
If you are not interested in development and just running the code. Just run the following command.

```base
docker run -e var1=val1 -e val2=var2 nubpaws/blue-discord-bot:latest
```

Where the `-e var=val` refers to environment variables that you need to setup and can be seen [here](#env-file-explained). You can also just create the `.env` file and run:

```bash
docker run --env-file .env nubpaws/blue-discord-bot:latest
```

### Running locally (with Node and npm)
1. Clone the repository.
2. Create a `.env` file based on the [.env file explained](#env-file-explained) section.
3. Run `npm install` to install dependencies.
4. Build the project using `npm run build`.
5. Make sure you have [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed and available in your path.
6. Start the bot with `npm start` or use `npm run dev` for development.

### Running in a container (with Docker + building the image)
1. Clone the repository.
2. Create a `.env` file based on the [.env file explained](#env-file-explained) section.
3. Run `docker compose up` to create the docker container.

## Commands

The list of commands can be seen by writing `[p]help` where `[p]` is the prefix you choose.
<br/>
A full list of commands will be presented here once we settle on the commands that we want to have.

## Env file explained.
You can use the `.env.example` file buy creating a copy of it running `cp .env.example .env`. Opening the file you'll see the following:

```ocaml
DISCORD_TOKEN=
PREFIX=

SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

YOUTUBE_API_KEY=
```

This section will explain what each of these mean, used for, and how to get them.

### `DISCORD_TOKEN`

The bot uses the token to log in as a bot. You can get that by following these steps:

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Login and create a new application.
3. Give your application a name.
4. After creating the application go to the sidebar and click on "**Bot**".
5. You can see your token by pressing "**Reset Token**". Every time you reset the token you need to update the token the variable.
6. Under "**Bot**" as well make sure you enable `MESSAGE CONTENT INTENT` to make the bot able to read messages.

### `PREFIX`
This is the prefix of the bot's command. Just pick whatever you want. I am using `!` but if you have a bot that already uses `!` use a different prefix, like `$` or `[blue]`. Literally anythin you can think of 😊.

### `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
These will be used to access information from spotify. So if you don't intend on using Spotify (to play songs from) then you can just ignore these and leave them blank.

To get them, do the following:

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/)
2. Log in with your Spotify account.
3. CLick "**Create an App**".
4. Fill in the name and description, agree to the terms, and create the app.
5. On the app page, you’ll see your **Client ID** and a button to "**Show Client Secret**".

### `YOUTUBE_API_KEY`

This will let you play playlists as this bot uses the API to access video names from playlists. This bot **DOES NOT RATE LIMIT API REQUESTS** as it will not (yet) be used in such a situation in *my* production case. However, if you need rate limiting, feel free to propose a commit or wait until it gets implemented. Apologies :D.

To get the api key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or use an existing one).
3. In the sidebar, go to "**APIs & Services**" > "**Library**".
4. Search for and enable "**YouTube Data API v3**".
5. Go to "**Credentials**".
6. Click "**Create Credentials**" > **API Key**.
