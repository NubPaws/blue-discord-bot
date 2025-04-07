import {
  ScoreboardAlreadyExistsError,
  ScoreboardDoesNotExistsError,
  ScoreboardInvalidAccessError,
} from '@/utils/fun/errors';
import fs from 'fs';
import path, { dirname } from 'path';

const BASE_PATH = path.resolve(
  dirname(require.main?.filename as string),
  '..',
  'data',
  'scoreboard',
);

function ensureDirectory(guildId: string) {
  const guildDir = path.join(BASE_PATH, guildId);
  if (!fs.existsSync(guildDir)) {
    fs.mkdirSync(guildDir, { recursive: true });
  }
}

function getScoreboardFilePath(guildId: string, scoreboardName: string): string {
  ensureDirectory(guildId);
  return path.join(BASE_PATH, guildId, `${scoreboardName}.csv`);
}

function loadScoreboard(guildId: string, scoreboardName: string): Record<string, number> {
  const filePath = getScoreboardFilePath(guildId, scoreboardName);
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  // Take all non-empty lines
  const lines = content.split('\n').filter((line) => line.trim().length > 0);

  const scoreboard: Record<string, number> = {};
  for (const line of lines) {
    const [userId, valueStr] = line.split(',');
    const value = parseInt(valueStr, 10);

    if (!isNaN(value)) {
      scoreboard[userId] = value;
    }
  }

  return scoreboard;
}

function writeScoreboard(guildId: string, scoreboardName: string, data: Record<string, number>) {
  const filePath = getScoreboardFilePath(guildId, scoreboardName);
  let lines = '';

  for (const [userId, val] of Object.entries(data)) {
    lines += `${userId},${val}\n`;
  }

  fs.writeFileSync(filePath, lines, 'utf-8');
}

function createScoreboard(guildId: string, scoreboardName: string) {
  const filePath = getScoreboardFilePath(guildId, scoreboardName);
  if (fs.existsSync(filePath)) {
    throw new ScoreboardAlreadyExistsError(scoreboardName);
  }

  fs.writeFileSync(filePath, '', 'utf-8');
}

function getScoreboard(guildId: string, scoreboardName: string) {
  return loadScoreboard(guildId, scoreboardName);
}

function setScore(guildId: string, scoreboardName: string, userId: string, value: number) {
  const scoreboard = loadScoreboard(guildId, scoreboardName);
  scoreboard[userId] = value;
  writeScoreboard(guildId, scoreboardName, scoreboard);
}

function removeScore(guildId: string, scoreboardName: string, userId: string) {
  const scoreboard = loadScoreboard(guildId, scoreboardName);
  if (scoreboard[userId] === undefined) {
    throw new ScoreboardInvalidAccessError(`User ${userId} does not exist in ${scoreboardName}`);
  }

  delete scoreboard[userId];
  writeScoreboard(guildId, scoreboardName, scoreboard);
}

function deleteScoreboard(guildId: string, scoreboardName: string) {
  const filePath = getScoreboardFilePath(guildId, scoreboardName);
  if (!fs.existsSync(filePath)) {
    throw new ScoreboardDoesNotExistsError(scoreboardName);
  }

  fs.rmSync(filePath);
}

export default {
  create: createScoreboard,
  get: getScoreboard,
  delete: deleteScoreboard,
  setScore,
  removeScore,
};
