import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Extra LD_LIBRARY_PATH for VPS environments with ~/playwright-libs/lib/
function buildLaunchEnv(): Record<string, string> | undefined {
  const home = process.env['HOME'];
  if (!home) return undefined;
  const playwrightLibs = resolve(home, 'playwright-libs', 'lib');
  if (!existsSync(playwrightLibs)) return undefined;
  return {
    LD_LIBRARY_PATH: [playwrightLibs, process.env['LD_LIBRARY_PATH']].filter(Boolean).join(':'),
  };
}

export default defineConfig({
  testDir: './e2e',
  outputDir: './e2e/test-results',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    launchOptions: {
      env: buildLaunchEnv(),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // i18n tests (filenames matching "language-switching") require the multi-locale
      // server on port 4201, so they are excluded from this project.
      testIgnore: /language-switching/,
    },
    {
      name: 'i18n',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201',
      },
      // Only run tests whose filenames match "language-switching". These tests
      // require the i18n static server (port 4201) that serves locale-prefixed
      // builds (/en/, /nl/, /de/). Any new i18n E2E test file must include
      // "language-switching" in its filename to be picked up by this project.
      testMatch: /language-switching/,
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      url: 'http://localhost:4200',
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
    },
    {
      command: 'npm run serve:i18n',
      url: 'http://localhost:4201',
      reuseExistingServer: !process.env['CI'],
      stdout: 'pipe',
      timeout: 10_000,
    },
  ],
});
