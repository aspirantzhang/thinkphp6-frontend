import puppeteer from 'puppeteer';
import * as pti from 'puppeteer-to-istanbul';

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

console.log(process.env);

const { HEADLESS } = process.env;
let puppeteerOption = {
  headless: false,
  slowMo: 25,
};
if (HEADLESS === true) {
  puppeteerOption = {};
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

  // modal add
  await page.waitForSelector('.before-table-layout .btn-add');
  await page.click('.before-table-layout .btn-add');
  await page.waitForSelector('.basic-list-modal .ant-modal-title');
  expect(await page.$eval('.basic-list-modal .ant-modal-title', (el) => el.innerText)).toBe(
    'Admin Add',
  );

  // invalid username
  await page.waitForSelector('#admin_name');
  await page.type('#admin_name', 'invalid');
  await page.type('#password', 'invalid');
  await page.click('.basic-list-modal .btn-submit');
  await page.waitForSelector('.process-message span:nth-child(2)');
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Processing...',
  );
  await page.waitForTimeout(2000);
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Error Message.',
  );

  // valid username
  await page.type('#admin_name', 'e2e');
  await page.type('#password', 'e2e');
  await page.click('.basic-list-modal .btn-submit');
  await page.waitForSelector('tbody tr:nth-child(1) td:nth-child(3)');
  expect(await page.$eval('tbody tr:nth-child(1) td:nth-child(3)', (el) => el.innerText)).toBe(
    'admin',
  );
  await page.waitForTimeout(2000);

  // edit
  await page.click('.basic-list-table .btn-edit');
  await page.waitForSelector('#admin_name');
  expect(await page.$eval('#admin_name', (el) => el.value)).toBe('admin');
  await page.click('.basic-list-modal .btn-submit');
  await page.waitForSelector('.process-message span:nth-child(2)');
  await page.waitForTimeout(500);
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Edit successfully.',
  );
  await page.waitForTimeout(2000);

  // delete
  await page.click('.basic-list-table .btn-delete');
  await page.waitForSelector('.batch-confirm-modal');
  await page.waitForSelector('.batch-overview-table');
  expect(await page.$eval('.batch-overview-table td:nth-child(2)', (el) => el.innerText)).toBe(
    'admin',
  );
  await page.click('.batch-confirm-modal .ant-btn-dangerous');
  await page.waitForTimeout(500);
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Delete successfully.',
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
