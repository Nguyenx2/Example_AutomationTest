import { LoginPage } from "@pages/login";
import { chromium } from "@playwright/test";
import * as dotenv from "dotenv";
import * as fs from "fs";
import path from "path";

dotenv.config();

async function globalSetup() {
  const STORAGE_STATE_PATH = "./test-data/auth/storageState.json";
  const username = process.env.EMAIL || "";
  const password = process.env.PASSWORD || "";
  const base_url = process.env.BASE_URL || "";
  const dir = path.dirname(STORAGE_STATE_PATH);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await page.goto(base_url, { timeout: 100000 });
  await loginPage.login(username, password);
  await context.storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}

export default globalSetup;
