const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file:///Users/admin/ScenePick/index.html');
  await page.click('.card[data-id="1"]');
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/Users/admin/ScenePick/detail_bottom.png' });
  await browser.close();
})();
