import * as dotenv from 'dotenv';
import * as path from 'path';

// ─────────────────────────────────────────────────────────────────────────────
//  Environment Config Loader
//
//  Reads the correct .env file based on the ENV variable.
//
//  Usage:
//    ENV=dev       npx playwright test   → loads .env.dev
//    ENV=staging   npx playwright test   → loads .env.staging
//    ENV=prod      npx playwright test   → loads .env.prod
//    (default)     npx playwright test   → loads .env.dev
// ─────────────────────────────────────────────────────────────────────────────

type Environment = 'dev' | 'staging' | 'prod';

const ENV: Environment = (process.env.ENV as Environment) ?? 'dev';

// Load the matching .env file
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${ENV}`),
  override: true,
});

// ── Typed config object ───────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: "${key}". ` +
      `Make sure .env.${ENV} exists and contains this key.`
    );
  }
  return value;
}

export const ENV_NAME = ENV;

export const CONFIG = {
  baseUrl: requireEnv('BASE_URL'),

  users: {
    standard: {
      username: requireEnv('STANDARD_USERNAME'),
      password: requireEnv('STANDARD_PASSWORD'),
    },
    locked: {
      username: requireEnv('LOCKED_USERNAME'),
      password: requireEnv('LOCKED_PASSWORD'),
    },
    problem: {
      username: requireEnv('PROBLEM_USERNAME'),
      password: requireEnv('PROBLEM_PASSWORD'),
    },
    performance_glitch: {
      username: requireEnv('PERF_USERNAME'),
      password: requireEnv('PERF_PASSWORD'),
    },
  },
} as const;

export type UserType = keyof typeof CONFIG.users;
