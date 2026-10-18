import { test, expect } from "@playwright/test";

test("all chapters open through the inventory and shelf", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const chapters = [
    "einstieg",
    "ueber-mich",
    "tech-stack",
    "profil",
    "kontakt",
  ];
  for (const chapter of chapters) {
    await page.locator(`#tab-${chapter}`).click();
    await expect(page.locator(`#panel-${chapter}`)).toBeVisible();
    await expect(page.getByRole("tabpanel")).toHaveCount(1);
    await expect(page.locator(`#tab-${chapter}`)).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(page).toHaveURL(new RegExp(`#${chapter}$`));
  }
  await page.locator(".book-one").click();
  await expect(page.locator("#panel-einstieg")).toBeVisible();
  await expect(page.locator("#previous-chapter")).toBeDisabled();
  await page.locator("#next-chapter").click();
  await expect(page.locator("#panel-ueber-mich")).toBeVisible();
  await expect(page.locator("#contact-links a")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: /LinkedIn/, includeHidden: true }),
  ).toHaveAttribute("href", "https://www.linkedin.com/in/adrian-thaqi-ob1w4n");
  await expect(
    page.getByRole("link", { name: /GitHub/, includeHidden: true }),
  ).toHaveAttribute("href", "https://github.com/aedn-sama");
  expect(errors).toEqual([]);
});

test("keyboard navigation, direct links and browser history work", async ({
  page,
}) => {
  await page.goto("/#tech-stack");
  await expect(page.locator("#panel-tech-stack")).toBeVisible();
  await page.locator("#tab-tech-stack").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#tab-profil")).toBeFocused();
  await expect(page.locator("#panel-profil")).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.locator("#tab-kontakt")).toBeFocused();
  await expect(page.locator("#next-chapter")).toBeDisabled();
  await page.keyboard.press("1");
  await expect(page.locator("#panel-einstieg")).toBeVisible();
  await page.goBack();
  await expect(page.locator("#panel-kontakt")).toBeVisible();
  await page.reload();
  await expect(page.locator("#panel-kontakt")).toBeVisible();
});

test("contact navigation and optional sound work", async ({ page }) => {
  await page.goto("/");
  await page.locator(".header-contact").click();
  await expect(page.locator("#panel-kontakt")).toBeVisible();
  await expect(page.locator("#panel-kontakt")).toBeFocused();
  await page.locator("#sound-toggle").click();
  await expect(page.locator("#sound-toggle")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.locator("#sound-toggle").click();
  await expect(page.locator("#sound-toggle")).toHaveAttribute(
    "aria-pressed",
    "false",
  );
});

for (const width of [320, 390, 768, 1440]) {
  test(`layout stays within a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    for (const chapter of [
      "einstieg",
      "ueber-mich",
      "tech-stack",
      "profil",
      "kontakt",
    ]) {
      await page.locator(`#tab-${chapter}`).click();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await page.locator("#tab-einstieg").click();
    await page.mouse.move(0, 0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `test-results/portfolio-${width}.png`,
      fullPage: true,
    });
    expect(
      await page
        .locator(".shelf-image")
        .evaluate((image) => image.complete && image.naturalWidth > 0),
    ).toBe(true);
  });
}

test("content remains readable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  for (const chapter of [
    "einstieg",
    "ueber-mich",
    "tech-stack",
    "profil",
    "kontakt",
  ]) {
    await expect(page.locator(`#panel-${chapter}`)).toBeVisible();
  }
  await context.close();
});
