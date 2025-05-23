import { VoiceConnection } from '@discordjs/voice';
import { MusicPlayer } from './musicPlayer';
import { NoActiveMusicPlayerError } from '@/cogs/music/errors';
import { VoiceBasedChannel } from 'discord.js';

const players: Map<string, MusicPlayer> = new Map();

export function getMusicPlayer(guildId: string): MusicPlayer {
  const player = players.get(guildId);
  if (!player) {
    throw new NoActiveMusicPlayerError();
  }

  return player;
}

export function createMusicPlayer(
  guildId: string,
  connection: VoiceConnection,
  channel: VoiceBasedChannel,
): MusicPlayer {
  const player = new MusicPlayer(connection, channel);
  players.set(guildId, player);

  return player;
}

export function removeMusicPlayer(guildId: string) {
  players.delete(guildId);
}
