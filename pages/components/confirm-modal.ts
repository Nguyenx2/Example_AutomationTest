import { Locator, Page } from "@playwright/test";

export class ConfirmModal {
  private page: Page;
  private modalBody: Locator;
  private titleModal: Locator;
  private contentModal: Locator;
  private confirmBtn: Locator;
  private cancelBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalBody = page.locator(
      "xpath=//div[contains(@id, 'modal_body')]//p"
    );
    this.titleModal = page.locator("xpath=//div[@class='modal-content']//h4");
    this.contentModal = page.locator("xpath=//div[@class='modal-body']//p");
    this.confirmBtn = page.locator(
      "xpath=//footer[contains(@class, 'modal-footer')]//child::button[2]"
    );
    this.cancelBtn = page.locator(
      "xpath=//footer[contains(@class, 'modal-footer')]//child::button[1]"
    );
  }

  //#region Actions
  async clickConfirmBtn(): Promise<void> {
    await this.confirmBtn.click();
  }

  async clickCancelBtn(): Promise<void> {
    await this.cancelBtn.click();
  }

  //#region Get element locator
  getModalBody(): Locator {
    return this.modalBody;
  }

  getTitleModal(): Locator {
    return this.titleModal;
  }

  getContentModal(): Locator {
    return this.contentModal;
  }

  getConfirmBtn(): Locator {
    return this.confirmBtn;
  }

  getCancelBtn(): Locator {
    return this.cancelBtn;
  }
}
