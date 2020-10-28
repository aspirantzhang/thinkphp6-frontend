import puppeteer from 'puppeteer';
const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

describe('Login', () => {
  it('login fail', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/user/login`);
    await page.waitForSelector('.ant-form');
    await page.type('#username', 'wrongUsername');
    await page.type('#password', 'wrongPassword');
    await page.click('button[type="submit"]');
    await page.waitForSelector('.ant-message-notice'); // should display error
    await page.close();
    browser.close();
  });
  it('login success', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/user/login`);
    await page.waitForSelector('.ant-form');
    await page.type('#username', 'admin0');
    await page.type('#password', 'admin0');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.waitForSelector('.ant-page-header-heading-title');
    expect(await page.$eval('.ant-page-header-heading-title', (node) => node.innerText)).toBe(
      'admin-list',
    );
    await page.close();
    browser.close();
  });
});
