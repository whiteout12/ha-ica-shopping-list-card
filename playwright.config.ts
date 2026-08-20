import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./browser",
  use: { baseURL: "http://127.0.0.1:5173/browser/fixture.html", screenshot: "only-on-failure" },
  webServer: {
    command: "npm run build && npm run dev",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 5"] } },
  ],
});
