import puppeteer from 'puppeteer';
import * as pti from 'puppeteer-to-istanbul';

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

const { NODE_ENV } = process.env;
let puppeteerOption = {};
if (NODE_ENV === 'test') {
  puppeteerOption = {
    headless: false,
    slowMo: 25,
  };
}

test('BasicList', async () => {
  const browser = await puppeteer.launch(puppeteerOption);
  const page = await browser.newPage();

  // Enable both JavaScript and CSS coverage
  await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

  // login
  await page.goto(`${BASE_URL}/user/login`);
  await page.waitForSelector('#username');
  await page.type('#username', 'admin');
  await page.type('#password', 'admin');
  await page.click("button[class='ant-btn ant-btn-primary ant-btn-lg']");
  await page.waitForNavigation();
  await page.goto(`${BASE_URL}/basic-list/api/admins`);

  // add
  await page.waitForSelector("button[class='ant-btn ant-btn-primary btn-add'] span");
  await page.click("button[class='ant-btn ant-btn-primary btn-add'] span");
  await page.waitForSelector('#admin_name');

  // invalid username
  await page.type('#admin_name', 'invalid');
  await page.type('#password', 'invalid');
  await page.click("button[class='ant-btn ant-btn-primary btn-submit']");
  await page.waitForSelector("div[class='ant-message'] span:nth-child(2)");
  expect(
    await page.$eval("div[class='ant-message'] span:nth-child(2)", (node) => node.innerText),
  ).toBe('Processing...');
  await page.waitForTimeout(2000);
  expect(
    await page.$eval("div[class='ant-message'] span:nth-child(2)", (node) => node.innerText),
  ).toBe('Error Message.');

  // valid username
  await page.type('#admin_name', 'e2eUser');
  await page.type('#password', 'e2ePass');
  await page.click("button[class='ant-btn ant-btn-primary btn-submit']");
  await page.waitForSelector('tbody tr:nth-child(1) td:nth-child(3)');
  expect(await page.$eval('tbody tr:nth-child(1) td:nth-child(3)', (node) => node.innerText)).toBe(
    'admin',
  );

  // Disable both JavaScript and CSS coverage
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);
  pti.write([...jsCoverage, ...cssCoverage], {
    includeHostname: true,
    storagePath: './.nyc_output',
  });

  await page.close();
  await browser.close();
});
