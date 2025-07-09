import { Locator, Page } from "@playwright/test";
import { ConfirmModal } from "./components/confirm-modal";
import { BasePage } from "./base-page";
import { NavigationBar } from "./components/navigation-bar";

export class InvoicePage extends BasePage {
  private popupFilterListTitle: Locator;
  private addFilterSelect: Locator;
  private applyFilterBtn: Locator;
  private cancelAddFilterBtn: Locator;
  private defaultBtn: Locator;
  private createInvoiceBtn: Locator;
  private invoiceNumberInp: Locator;
  private searchBtn: Locator;
  private signIcon: Locator;
  private operationIcon: Locator;
  private recordsQuantity: Locator;
  private confirmModal: ConfirmModal;

  constructor(page: Page, navigationBar: NavigationBar) {
    super(page, navigationBar);
    this.confirmModal = new ConfirmModal(page);
    this.popupFilterListTitle = page.locator(
      "xpath=//h6[normalize-space()='Danh sách bộ lọc']"
    );
    this.addFilterSelect = page.locator(
      "xpath=//div[contains(@class, 'checkbox-selected add-filter')]/parent::div"
    );
    this.applyFilterBtn = page.locator(
      "xpath=//button[normalize-space()='Áp dụng']"
    );
    this.cancelAddFilterBtn = page.locator(
      "xpath=//button[normalize-space()='Hủy bỏ']"
    );
    this.defaultBtn = page.locator(
      "xpath=//button[normalize-space()='Mặc định']"
    );
    this.createInvoiceBtn = page.locator(
      "xpath=//button[@id='btnOpenInvoice']"
    );
    this.invoiceNumberInp = page.locator(
      "xpath=//input[@placeholder='Số hóa đơn']"
    );
    this.searchBtn = page.locator(
      "xpath=//button[normalize-space()='Tìm kiếm']"
    );
    this.signIcon = page.locator(
      "xpath=(//img[@alt='drag_indicator']//parent::div)[1]"
    );
    this.operationIcon = page.locator(
      "xpath=(//li[contains(@id, 'dot-more-action')])[1]"
    );
    this.recordsQuantity = page.locator("xpath=//div[@class='card-footer']//p");
  }

  async waitForPageLoad(): Promise<void> {
    const titlePage = "#e-invoice-page h4";

    await this.page.waitForSelector(titlePage);
    await this.page.waitForSelector("tr[aria-rowindex='1']");
  }

  //#region Actions
  async clickAddFilterSelect(): Promise<void> {
    await this.addFilterSelect.click();
  }

  async clickFilterCb(filterCb: string): Promise<void> {
    await this.page
      .locator(`xpath=//label[normalize-space()='${filterCb}']/parent::div`)
      .click();
  }

  async clickApplyFilter(): Promise<void> {
    await this.applyFilterBtn.click();
  }

  async fillFilterInput(filter: string, data: string): Promise<void> {
    await this.getFilterInputElement(filter).fill(data);
  }

  //#region Get locator element
  getFilterCbElement(filter: string): Locator {
    return this.page.locator(
      `xpath=//label[normalize-space()='${filter}']/preceding-sibling::input`
    );
  }

  getFilterInputElement(filter: string): Locator {
    return this.page.locator(`xpath=//input[@placeholder='${filter}']`);
  }

  //#region Handle logic
  async setFilterCheckbox(filterName: string, shouldCheck: boolean) {
    await this.clickAddFilterSelect();

    const isChecked = await this.getFilterCbElement(filterName).isChecked();

    if (shouldCheck !== isChecked) {
      await this.clickFilterCb(filterName);
    }

    await this.clickApplyFilter();
  }
}
