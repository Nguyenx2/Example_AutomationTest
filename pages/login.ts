import { Page } from "@playwright/test";

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private emailInput = "//input[@id='Username']";
  private passwordInput = "//input[@id='Password']";
  private loginButton = "//form[contains(@class, 'auth-login-form')]//button";
  private confirmButton = "//button[@aria-label='OK']";
  private continueButton = "//button[@value='continue']";

  // Fill email
  async fillEmail(email: string): Promise<void> {
    await this.page.locator(`xpath=${this.emailInput}`).fill(email);
  }

  // Fill password
  async fillPassword(password: string): Promise<void> {
    await this.page.locator(`xpath=${this.passwordInput}`).fill(password);
  }

  // Click login button
  async clickLogin(): Promise<void> {
    await this.page.locator(`xpath=${this.loginButton}`).click();
  }

  async clickOKButton(): Promise<void> {
    await this.page.locator(`xpath=${this.confirmButton}`).click();
  }

  // Login
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickLogin();

    if (await this.page.locator(this.continueButton).isVisible()) {
      await this.page.locator(this.continueButton).click();
    }
  }
}
