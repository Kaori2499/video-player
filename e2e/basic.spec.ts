import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("renders player layout regions", async ({ page }) => {
  await expect(page.getByTestId("demo-loading")).toBeHidden({
    timeout: 60_000,
  });
  await expect(page.getByTestId("player-layout")).toBeVisible();
  await expect(page.getByTestId("player-layout-header")).toBeVisible();
  await expect(page.getByTestId("player-layout-content")).toBeVisible();
  await expect(page.getByTestId("player-layout-footer")).toBeVisible();
  await expect(page.getByTestId("player-layout-background")).toBeVisible();
  await expect(page.locator("[data-vp-preview]")).toBeVisible();
  await expect(page.getByTestId("player-layout-filter")).toBeVisible();
  await expect(page.getByTestId("player-layout")).toHaveAttribute(
    "data-video-count",
    /[1-9]/,
  );
});
