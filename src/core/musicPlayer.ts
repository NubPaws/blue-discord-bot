import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, createAudioResource, VoiceConnection } from "@discordjs/voice";
import ytdl from "ytdl-core";

interface Song {
  title: string;
  url: string;
}

export class MusicPlayer {
  private queue: Song[] = [];
  private audioPlayer: AudioPlayer = createAudioPlayer();

  constructor(private connection: VoiceConnection) {
    connection.subscribe(this.audioPlayer);
  }

  public enqueue(song: Song) {
    this.queue.push(song);
  }

  public async playNext() {
    if (this.queue.length === 0) {
      return;
    }

    const song = this.queue.shift()!;

    const stream = ytdl(song.url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    // Play the song, once the song ends, go to the next one.
    this.audioPlayer.play(resource);
    this.audioPlayer.once('idle', () => this.playNext());
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
    return this.queue.map((song) => song);
  }
}
