import { test as base } from "@playwright/test";
import { InvoicePage } from "@pages/invoice-page";
import { NavigationBar } from "@pages/components/navigation-bar";

type InvoiceFixture = {
  invoicePage: InvoicePage;
  navigationBar: NavigationBar;
};

export const invoiceTest = base.extend<InvoiceFixture>({
  navigationBar: async ({ page }, use) => {
    const navigationBar = new NavigationBar(page);
    await use(navigationBar);
  },

  invoicePage: async ({ page, navigationBar }, use) => {
    await page.goto("/");
    let invoicePage = await navigationBar.clickInvoiceTab();

    await invoicePage.waitForPageLoad();
    await use(invoicePage);
  },
});
