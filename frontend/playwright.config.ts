export default defineConfig({
  testDir: "./tests/playwright",
  fullParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  outputDir: "tests/plawright/test-results",
  reporter: [["html", {outputFolder: "tests/playwright/report"}]]
  use: {
    video: "on-first-retry",
    trace: "on-first-retry",
    testIdAttribute: "data-qa",
  },

  projects: [
    {
      name: "chromium",
      use: {...devices["Desktop Chrome"]},
    },
  ],
});