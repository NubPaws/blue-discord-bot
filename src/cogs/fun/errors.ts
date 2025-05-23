export class ScoreboardAlreadyExistsError extends Error {
  constructor(scoreboardName: string) {
    super(`Scoreboard named ${scoreboardName} already exists, try a different name.`);
  }
}

export class ScoreboardInvalidAccessError extends Error {}

export class ScoreboardDoesNotExistsError extends Error {}
