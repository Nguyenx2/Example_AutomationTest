import { Locator, Page } from "@playwright/test";
import { NavigationBar } from "./components/navigation-bar";
import { LoginPage } from "./login";

export class BasePage {
  protected page: Page;
  protected navigationBar: NavigationBar;
  private dropdownUser: Locator;
  private logoutBtn: Locator;

  constructor(page: Page, navigationBar: NavigationBar) {
    this.page = page;
    this.navigationBar = navigationBar;
    this.dropdownUser = page.locator(
      "xpath=//li[contains(@class, 'dropdown-user')]"
    );
    this.logoutBtn = page.locator(
      "xpath=//span[normalize-space()='Đăng xuất']//parent::a"
    );
  }

  //#region Actions
  async logout(): Promise<LoginPage> {
    await this.dropdownUser.click();
    await this.logoutBtn.click();

    return new LoginPage(this.page);
  }

  public getNavigationBar(): NavigationBar {
    return this.navigationBar;
  }
}
