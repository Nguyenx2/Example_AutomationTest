import { Locator, Page } from "@playwright/test";
import { InvoicePage } from "../invoice-page";

export class NavigationBar {
  private page: Page;
  private invoiceTab: Locator;
  private reportTab: Locator;
  private configTab: Locator;
  private actionLogsTab: Locator;
  private userManagementTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.invoiceTab = page.locator(
      "xpath=//span[normalize-space()='Hóa đơn']/parent::a"
    );
    this.reportTab = page.locator(
      "xpath=//span[normalize-space()='Báo cáo']/parent::a"
    );
    this.configTab = page.locator(
      "xpath=//span[normalize-space()='Cấu hình']/parent::a"
    );
    this.actionLogsTab = page.locator(
      "xpath=//span[normalize-space()='Log thao tác']/parent::a"
    );
    this.userManagementTab = page.locator(
      "xpath=//span[normalize-space()='Quản lý người dùng']/parent::a"
    );
  }

  //#region Actions
  async clickInvoiceTab(): Promise<InvoicePage> {
    await this.invoiceTab.click();

    return new InvoicePage(this.page, this);
  }
}
