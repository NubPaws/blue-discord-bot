import { VoiceConnection } from '@discordjs/voice';
import { MusicPlayer } from './musicPlayer';
import { NoActiveMusicPlayerError } from '../utils/errors';

const players: Map<string, MusicPlayer> = new Map();

export function getMusicPlayer(guildId: string): MusicPlayer {
  const player = players.get(guildId);
  if (!player) {
    throw new NoActiveMusicPlayerError();
  }

  return player;
}

export function createMusicPlayer(guildId: string, connection: VoiceConnection): MusicPlayer {
  const player = new MusicPlayer(connection);
  players.set(guildId, player);
  return player;
}

export function removeMusicPlayer(guildId: string) {
  players.delete(guildId);
}
