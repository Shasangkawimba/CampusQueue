import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Desktop
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\desktop.png' });

  // Mobile
  await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\mobile.png' });

  await browser.close();
})();
