import puppeteer from 'puppeteer';
import * as pti from 'puppeteer-to-istanbul';

test('BasicList', async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 20,
  });
  const page = await browser.newPage();

  // Enable both JavaScript and CSS coverage
  await Promise.all([page.coverage.startJSCoverage(), page.coverage.startCSSCoverage()]);

  // login
  await page.goto('http://localhost:8000/user/login');
  await page.waitForSelector('#username');
  await page.type('#username', 'admin');
  await page.type('#password', 'admin');
  await page.click("button[class='ant-btn ant-btn-primary ant-btn-lg']");
  await page.waitForNavigation();
  await page.goto('http://localhost:8000/basic-list/api/admins');

  // add
  await page.waitForSelector("button[class='ant-btn ant-btn-primary btn-add'] span");
  await page.click("button[class='ant-btn ant-btn-primary btn-add'] span");
  await page.waitForSelector('#admin_name');
  await page.type('#admin_name', 'e2eUser');
  await page.type('#password', 'e2ePass');
  await page.click("button[class='ant-btn ant-btn-primary btn-submit']");
  expect(await page.$eval('tbody tr:nth-child(1) td:nth-child(3)', (node) => node.innerText)).toBe(
    'e2eUser',
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
