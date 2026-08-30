import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1440, height: 900 });

  // 1. TakeQueue page
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\new_take_queue.png' });
  
  // 1b. TakeQueue page (dark mode)
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\new_take_queue_dark.png' });

  // 2. Login Page
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark');
  });
  await new Promise(resolve => setTimeout(resolve, 500));
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\new_login.png' });

  // 3. Status Page
  await page.goto('http://localhost:5173/status/1', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\new_status.png' });

  // Log in to capture Admin Dashboard
  await page.goto('http://localhost:5173/admin/login', { waitUntil: 'networkidle0' });
  await page.type('input[type="text"]', 'admin_a');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\4186c688-e315-4601-87f0-5af527f91109\\new_dashboard.png' });
  
  await browser.close();
  console.log('Screenshots captured.');
})();
