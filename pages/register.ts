import { Locator, Page } from "@playwright/test";

export class RegisterPage {
  private page: Page;
  private readonly usernameInput: string = "//input[@id='name']";
  private readonly emailInput: string = "//input[@id='email']";
  private readonly passwordInput: string = "//input[@id='password']";
  private readonly pwdConfInput: string = "//input[@id='password_confirmation'";
  private readonly registerBtn: string = "//button[@type='submit']";
  private readonly usernameErrMsg: string =
    "//input[@id='name']//following-sibling::p";
  private readonly emailErrMsg: string =
    "//input[@id='email']//following-sibling::p";
  private readonly passwordErrMsg: string =
    "//input[@id='password']//following-sibling::p";
  private readonly passConfirmErrMsg: string =
    "//input[@id='password_confirmation']//following-sibling::p";

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto("/");
  }

  async pause(): Promise<void> {
    await this.page.pause();
  }

  async waitForElement(locator: string): Promise<void> {
    await this.page.waitForSelector(locator);
  }

  async fillUsername(username: string): Promise<void> {
    await this.page.locator(this.usernameInput).fill(username);
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.locator(this.emailInput).fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.page.locator(this.passwordInput).fill(password);
  }

  async fillPasswordConfirm(passwordComfirm: string): Promise<void> {
    await this.page.locator(this.pwdConfInput).fill(passwordComfirm);
  }

  async clickRegisterBtn(): Promise<void> {
    await this.page.locator(this.registerBtn).click();
  }

  async register(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ): Promise<void> {
    await this.fillUsername(username);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillPasswordConfirm(passwordConfirm);
    await this.clickRegisterBtn();
  }

  async submitEmptyForm(): Promise<void> {
    await this.clickRegisterBtn();
  }

  async getUsernameError(): Promise<string> {
    try {
      await this.waitForElement(this.usernameErrMsg);
      return (await this.page.locator(this.usernameErrMsg).textContent()) || "";
    } catch (error) {
      return "";
    }
  }

  async getEmailError(): Promise<string> {
    try {
      await this.waitForElement(this.emailErrMsg);
      return (await this.page.locator(this.emailErrMsg).textContent()) || "";
    } catch (error) {
      return "";
    }
  }

  async getPasswordError(): Promise<string> {
    try {
      await this.waitForElement(this.passwordErrMsg);
      return (await this.page.locator(this.passwordErrMsg).textContent()) || "";
    } catch (error) {
      return "";
    }
  }

  async getPasswordConfirmError(): Promise<string> {
    try {
      await this.waitForElement(this.passConfirmErrMsg);
      return (
        (await this.page.locator(this.passConfirmErrMsg).textContent()) || ""
      );
    } catch (error) {
      return "";
    }
  }

  async getAllValidationErrors(): Promise<Record<string, string>> {
    return {
      username: await this.getUsernameError(),
      email: await this.getEmailError(),
      password: await this.getPasswordError(),
      passwordConfirm: await this.getPasswordConfirmError(),
    };
  }
}
