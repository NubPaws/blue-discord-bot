import pino, { LoggerOptions } from 'pino';
import path from 'node:path';
import environment from '@/config/environment';

const { logLevel = 'info', logPretty = 'true', logFile } = environment.logger;

const commonOpts: LoggerOptions = {
  level: logLevel,
  timestamp: pino.stdTimeFunctions.isoTime,
};

const streams: pino.DestinationStream[] = [];

if (logPretty === 'true') {
  streams.push(
    pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    }),
  );
} else {
  streams.push(process.stdout);
}

const logger = pino(commonOpts, pino.multistream(streams));

export default logger;

export type Log = typeof logger;
