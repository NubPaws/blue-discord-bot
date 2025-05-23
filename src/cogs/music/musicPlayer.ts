import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Song } from '@/cogs/music/types/Song';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { VoiceBasedChannel, VoiceState } from 'discord.js';
import client from '@/client';

export class MusicPlayer {
  private connection: VoiceConnection;
  private player: AudioPlayer;
  private queue: Song[] = [];
  private currentProcess: ChildProcessWithoutNullStreams | null = null;

  private channel: VoiceBasedChannel;

  constructor(connection: VoiceConnection, channel: VoiceBasedChannel) {
    this.connection = connection;
    this.channel = channel;

    this.player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Stop },
    });

    this.connection.subscribe(this.player);

    client.internal.on('voiceStateUpdate', (oldState, newState) => {
      this.onVoiceStateUpdate(oldState, newState);
    });
  }

  public enqueue(song: Song): void {
    this.queue.push(song);
  }

  public playNext(): void {
    if (this.player.state.status !== AudioPlayerStatus.Idle) {
      this.player.stop(true);
    }
    this.killCurrentProcess();

    if (this.queue.length === 0) {
      return;
    }

    const nextSong = this.queue.shift()!;
    this.currentProcess = spawn('yt-dlp', [
      '-o',
      '-',
      '-f',
      'bestaudio/best',
      nextSong.url,
    ]);

    const resource = createAudioResource(this.currentProcess.stdout);
    this.player.play(resource);
  }

  public pause(): void {
    if (this.player.state.status === AudioPlayerStatus.Playing) {
      this.player.pause();
    }
  }

  public resume(): void {
    if (this.player.state.status === AudioPlayerStatus.Paused) {
      this.player.unpause();
    }
  }

  public stop(): void {
    this.queue = [];
    this.player.stop(true);
    this.killCurrentProcess();
  }

  public skip(): void {
    this.player.stop(true);
    this.killCurrentProcess();
    this.playNext();
  }

  public getQueue(): Song[] {
    return this.queue;
  }

  get isPlaying(): boolean {
    return this.player.state.status === AudioPlayerStatus.Playing;
  }

  private killCurrentProcess(): void {
    if (this.currentProcess) {
      this.currentProcess.kill('SIGTERM');
      this.currentProcess = null;
    }
  }

  private onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState): void {
    const oldChannelId = oldState.channelId;
    const newChannelId = newState.channelId;
    if (oldChannelId !== this.channel.id && newChannelId !== this.channel.id) {
      return;
    }

    this.channel
      .fetch()
      .then((voiceChannel) => {
        // Count members that aren't bots
        const nonBotMembers = voiceChannel.members.filter(
          (member) => !member.user.bot,
        );
        if (nonBotMembers.size === 0) {
          // No real users are left, so let's disconnect.
          this.disconnect();
        }
      })
      .catch(() => {
        // If channel doesn't exist or some error, also safe to disconnect.
        this.disconnect();
      });
  }

  public disconnect(): void {
    this.stop();
    if (this.connection.state.status !== VoiceConnectionStatus.Destroyed)
      this.connection.destroy();
  }
}
