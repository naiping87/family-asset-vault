const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const screenshotDir = "screenshots";
  const fs = require("fs");
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  async function snap(name) {
    await page.screenshot({ path: `${screenshotDir}/${name}.png`, fullPage: false });
    console.log("  OK:", name);
  }

  // 1. Login page
  console.log("1. Login Page");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await snap("01-login");

  // 2. Register page
  console.log("2. Register Page");
  await page.goto("http://localhost:3000/register", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await snap("02-register");

  // 3. Login
  console.log("3. Login...");
  await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', "demo@familyvault.test");
  await page.fill('input[name="password"]', "demo123456");
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL("**/dashboard**", { timeout: 8000 });
    console.log("   Login OK");
  } catch {
    console.log("   Login may have failed, continuing with current URL:", page.url());
  }
  await page.waitForTimeout(1000);

  if (page.url().includes("/dashboard")) {
    // 4. Dashboard
    console.log("4. Dashboard");
    await snap("03-dashboard");

    // Scroll to see more content
    await page.evaluate(() => window.scrollTo(0, 200));
    await snap("04-dashboard-below");

    // 5. Properties list
    console.log("5. Properties");
    await page.goto("http://localhost:3000/dashboard/properties", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await snap("05-properties");

    // 6. Property Detail - click first card
    console.log("6. Property Detail");
    const propLink = await page.locator('a[href*="/dashboard/properties/"]').first().getAttribute("href");
    if (propLink) {
      await page.goto("http://localhost:3000" + propLink, { waitUntil: "networkidle" });
      await page.waitForTimeout(500);
      await snap("06-property-detail");
      // Scroll down for tax/tenancy sections
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(300);
      await snap("07-property-detail-below");
    }

    // 7. Add Property
    console.log("7. Add Property");
    await page.goto("http://localhost:3000/dashboard/properties/new", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await snap("08-property-new");

    // 8. Insurances
    console.log("8. Insurances");
    await page.goto("http://localhost:3000/dashboard/insurances", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await snap("09-insurances");

    // 9. Add Insurance
    console.log("9. Add Insurance");
    await page.goto("http://localhost:3000/dashboard/insurances/new", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await snap("10-insurance-new");

    // 10. Settings
    console.log("10. Settings");
    await page.goto("http://localhost:3000/dashboard/settings", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    await snap("11-settings");
  } else {
    console.log("Not on dashboard, checking for error...");
    await snap("99-error-state");
  }

  await browser.close();
  console.log("\nDONE -", fs.readdirSync(screenshotDir).length, "screenshots saved");
})();
