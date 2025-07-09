import { invoiceTest } from "@fixtures/invoice.fixture";
import { expect } from "@playwright/test";

invoiceTest.describe(
  "Danh sách Hóa đơn >> Tham số Tìm kiếm >> Mã cơ quan thuế",
  () => {
    const taxAuthorityCode: string = "Mã cơ quan thuế";

    invoiceTest("TC.DSHD.043", async ({ invoicePage }) => {
      await invoicePage.setFilterCheckbox(taxAuthorityCode, false);

      await expect(
        invoicePage.getFilterInputElement(taxAuthorityCode)
      ).not.toBeVisible();
    });

    invoiceTest.describe(() => {
      invoiceTest.beforeEach(async ({ invoicePage }) => {
        await invoicePage.setFilterCheckbox(taxAuthorityCode, true);
      });

      invoiceTest("TC.DSHD.044", async ({ invoicePage }) => {
        await expect(
          invoicePage.getFilterInputElement(taxAuthorityCode)
        ).toBeVisible();
      });

      invoiceTest.only("TC.DSHD.045", async ({ invoicePage }) => {
        const data: string = "0MMMMMM32547686A@";
        const data2: string = "0MMMMMM";

        await invoicePage.fillFilterInput(taxAuthorityCode, data);

        await expect(
          invoicePage.getFilterInputElement(taxAuthorityCode)
        ).toHaveValue(data);

        await expect(
          invoicePage.getFilterInputElement(taxAuthorityCode)
        ).toHaveValue(data2);
      });
    });
  }
);
