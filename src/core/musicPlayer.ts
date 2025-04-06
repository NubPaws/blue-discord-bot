import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  VoiceConnection,
} from '@discordjs/voice';
import { Song } from '../types/Song';
import logger from '../utils/logger';
import { spawn } from 'child_process';
import Stream from 'stream';

function createYtDlpStream(url: string): Stream.Readable {
  const ytdlp = spawn('yt-dlp', [
    '--quiet', // Suppress non-critical output.
    '--no-progress', // Disable the progress bar.
    '-f',
    'bestaudio',
    '-o',
    '-', // Output to stdout.
    url,
  ]);

  ytdlp.stderr.on('data', (data) => {
    logger.log('yt-dlp', `${data}`);
  });

  ytdlp.on('exit', (code) => {
    logger.log('yt-dlp', `Exited with code ${code}`);
  });

  return ytdlp.stdout;
}

function createFfmpegStream(stream: Stream.Readable): Stream.Readable {
  const ffmpeg = spawn('ffmpeg', [
    '-loglevel',
    '0', // Suppress non-error logs.
    '-i',
    'pipe:0', // Input from yt-dlp's stdout.
    '-f',
    'opus', // Output format: Opus.
    '-ar',
    '48000', // Set sample rate to 48000 Hz.
    '-ac',
    '2', // Output stereo audio.
    'pipe:1', // Output to stdout.
  ]);

  ffmpeg.stderr.on('data', (data) => {
    logger.log('ffmpeg', `Error: ${data}`);
  });

  ffmpeg.on('exit', (code) => {
    logger.log('ffmpeg', `Exited with code ${code}`);
  });

  stream.pipe(ffmpeg.stdin);

  return ffmpeg.stdout;
}

export class PlayingSongError extends Error {}

export class MusicPlayer {
  private queue: Song[] = [];
  private audioPlayer: AudioPlayer = createAudioPlayer();

  constructor(private connection: VoiceConnection) {
    connection.subscribe(this.audioPlayer);

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      if (this.queue.length > 0) {
        this.playNext();
      }
    });

    // Simple error handler here.
    this.audioPlayer.on('error', (error) => {
      logger.error('Audio palyer error:', error);
      if (this.queue.length > 0) {
        this.playNext();
      }
    });
  }

  public enqueue(song: Song) {
    this.queue.push(song);
    if (this.audioPlayer.state.status !== AudioPlayerStatus.Playing) {
      this.playNext();
    }
  }

  public async playNext() {
    if (this.queue.length === 0) {
      return;
    }

    const song = this.queue.shift()!;

    try {
      const ytDlpStream = createYtDlpStream(song.url);

      const ffmpegStream = createFfmpegStream(ytDlpStream);

      const resource = createAudioResource(ffmpegStream);
      this.audioPlayer.play(resource);
    } catch (error) {
      this.playNext();
      throw new PlayingSongError(`${error}`);
    }
  }

  public stop() {
    this.queue = [];
    this.audioPlayer.stop();
  }

  public skip() {
    this.audioPlayer.stop();
  }

  public isPlaying(): boolean {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  public disconnect() {
    this.queue = [];
    this.audioPlayer.stop();
    this.connection.destroy();
  }

  public getQueue(): Song[] {
    return this.queue.map((song) => ({ title: song.title, url: song.url }));
  }
}
