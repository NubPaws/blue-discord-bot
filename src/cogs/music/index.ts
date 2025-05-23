import { PlayCommand } from '@/cogs/music/commands/play';
import { QueueCommand } from '@/cogs/music/commands/queue';
import { DisconnectCommand } from '@/cogs/music/commands/disconnect';
import { PauseCommand } from '@/cogs/music/commands/pause';
import { ResumeCommand } from '@/cogs/music/commands/resume';
import { SkipCommand } from '@/cogs/music/commands/skip';
import { StopCommand } from '@/cogs/music/commands/stop';

export default [
  new PlayCommand(),
  new QueueCommand(),
  new DisconnectCommand(),
  new SkipCommand(),
  new StopCommand(),
  new PauseCommand(),
  new ResumeCommand(),
];
