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
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
