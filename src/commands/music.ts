import { DisconnectCommand } from '@/commands/music/disconnect';
import { PauseCommand } from '@/commands/music/pause';
import { PlayCommand } from '@/commands/music/play';
import { QueueCommand } from '@/commands/music/queue';
import { ResumeCommand } from '@/commands/music/resume';
import { SkipCommand } from '@/commands/music/skip';
import { StopCommand } from '@/commands/music/stop';

export default [
  new PlayCommand(),
  new QueueCommand(),
  new DisconnectCommand(),
  new SkipCommand(),
  new StopCommand(),
  new PauseCommand(),
  new ResumeCommand(),
];
