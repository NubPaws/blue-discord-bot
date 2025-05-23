import { createMusicPlayer, getMusicPlayer } from '@/cogs/music/musicManager';
import { MusicPlayer } from '@/cogs/music/musicPlayer';
import { Command } from '@/types/Command';
import { Song } from '@/cogs/music/types/Song';
import { GuildNotFoundError, InvalidCommandArgumentsError } from '@/errors';
import spotifyHandler from '@/cogs/music/utils/spotifyHandler';
import { isValidUrl } from '@/cogs/music/utils/urlValidators';
import youtubeHandler from '@/cogs/music/utils/youtubeHandler';
import { joinVoiceChannel } from '@discordjs/voice';
import { Message, VoiceChannel } from 'discord.js';
import { CommandResponse } from '@/types/Response';
import { CommandHelpBuilder } from '@/utils/commandHelpBuilder';

export class PlayCommand extends Command {
  constructor() {
    super('play', 'Plays a song from YouTube or Spotify by searching for it.', [
      'p',
    ]);
  }

  public async execute(
    message: Message,
    args: string[],
  ): Promise<CommandResponse> {
    if (!args.length) {
      throw new InvalidCommandArgumentsError();
    }

    const voiceChannel = message.member?.voice.channel;
    if (!voiceChannel) {
      return CommandResponse.message('You need to join a voice channel first!');
    }

    const guildId = message.guild?.id;
    if (!guildId) {
      throw new GuildNotFoundError();
    }

    const query = args.join(' ');
    const songs = await this.getSongsFromQuery(query);

    if (songs.length === 0) {
      return CommandResponse.message('No songs found.');
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
      player = createMusicPlayer(guildId, connection, voiceChannel);
    }

    for (const song of songs) {
      player.enqueue(song);
    }

    if (!player.isPlaying) {
      player.playNext();
    }

    if (songs.length > 1) {
      return CommandResponse.message(
        `Enqueued ${songs.length} songs from your playlist/search.`,
      );
    } else {
      if (player.isPlaying) {
        return CommandResponse.message(
          `Song ${songs[0].title} added to queue.`,
        );
      }
      return CommandResponse.message(`Now playing: ${songs[0].title}.`);
    }
  }

  private async getSongsFromQuery(query: string): Promise<Song[]> {
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

    throw new InvalidCommandArgumentsError('Unsupported URL.');
  }

  public help(): string {
    return new CommandHelpBuilder()
      .command(this.name, this.description)
      .usage(`${this.name} <song name or URL>`)
      .toString();
  }
}
