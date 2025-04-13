import { test, expect } from "@playwright/test";

test("home page loads and displays main heading", async ({ page }) => {
  await page.goto("/");
  // Adjust the selector/text below to match your actual home page heading
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  // Optionally, check for a key phrase or element unique to your home page
  // await expect(page.getByText(/Karthik Nishanth/i)).toBeVisible();
});
