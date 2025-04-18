import test, { expect, Page } from "@playwright/test";
import { RegisterPage } from "../pages/register";

test.describe("User Registration Functionally", () => {
  let registerPage: RegisterPage;

  const generateRandomEmail = (): string => {
    return `test${Math.floor(Math.random() * 10_000)}@example.com`;
  };

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
  });

  test("Validation errors when submitting empty form", async () => {
    await registerPage.submitEmptyForm();

    const errors = await registerPage.getAllValidationErrors();

    expect(errors.username).toBe("Tên không được để trống");
    expect(errors.email).toBe("Email là bắt buộc");
    expect(errors.password).toBe("Mật khẩu ít nhất 6 ký tự");
    expect(errors.passwordConfirm).toBe("Bắt buộc xác nhận mật khẩu");
  });
});
