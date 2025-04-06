import { Message } from "discord.js";
import { Command } from "../types/Command";
import { isValidUrl } from "../utils/urlValidators";
import { Song } from "../types/Song";
import { GuildNotFoundError, InvalidCommandArgumentsError } from "../utils/errors";
import youtubeHandler from "../utils/youtubeHandler";
import spotifyHandler from "../utils/spotifyHandler";
import { createMusicPlayer, getMusicPlayer } from "../core/musicManager";
import { MusicPlayer } from "../core/musicPlayer";
import { joinVoiceChannel } from "@discordjs/voice";

async function getSongsFromQuery(query: string): Promise<Song[]> {
  if (!isValidUrl(query)) {
    return [await youtubeHandler.fetchSearch(query)];
  }

  if (youtubeHandler.isUrl(query)) {
    return youtubeHandler.fetch(query);
  }

  if (spotifyHandler.isUrl(query)) {
    const spotifySongs = await spotifyHandler.fetch(query);
    const songs: Song[] = [];

    for (const song of spotifySongs) {
      songs.push(await spotifyHandler.searchYouTube(song));
    }

    return songs;
  }

  // If we didn't match to anything, just fail.
  throw new InvalidCommandArgumentsError('Unsupported URL.');
}

const command: Command = {
  name: 'play',
  aliases: ['p'],
  description: 'Plays a song from YouTube or Spotify by searching for it.',
  async execute(message: Message, args: string[]) {
    if (!args.length) {
      await message.reply('Please provide a song name or URL.');
      return;
    }

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      await message.reply('You need to join a voice channel first!');
      return;
    }

    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const query = args.join(' ');
    const songs = await getSongsFromQuery(query);

    if (songs.length === 0) {
      await message.reply("No songs founds.");
      return;
    }

    let player: MusicPlayer;
    try {
      player = getMusicPlayer(guildId);
    } catch {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });
      player = createMusicPlayer(guildId, connection);
    }

    for (const song of songs) {
      player.enqueue(song);
    }

    if (!player.isPlaying) {
      player.playNext();
    }

    if (songs.length > 1) {
      await message.reply(`Enqueued ${songs.length} songs from your playlist/search.`);
    } else {
      await message.reply(`Now playing: ${songs[0].title}`);
    }

  },
};

export default command;
