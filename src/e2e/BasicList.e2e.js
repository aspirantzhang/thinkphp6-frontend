import puppeteer from 'puppeteer';
import * as pti from 'puppeteer-to-istanbul';

const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

const { CI } = process.env;
let puppeteerOption = {
  headless: false,
  slowMo: 25,
};
if (CI === 'true') {
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

  // list
  await page.goto(`${BASE_URL}/basic-list/api/tests`);
  await page.waitForSelector('.ant-page-header-heading-title');
  expect(await page.$eval('.ant-page-header-heading-title', (el) => el.innerText)).toBe(
    'Test List',
  );
  await page.waitForSelector('.basic-list-table tbody tr:nth-child(1) td:nth-child(3)');
  expect(
    await page.$eval(
      '.basic-list-table tbody tr:nth-child(1) td:nth-child(3)',
      (el) => el.innerText,
    ),
  ).toBe('single-line-text-value');
  await page.waitForSelector('.before-table-layout .reload-btn');
  await page.click('.before-table-layout .reload-btn');
  await page.waitForTimeout(1000);
  expect(
    await page.$eval(
      '.basic-list-table tbody tr:nth-child(1) td:nth-child(3)',
      (el) => el.innerText,
    ),
  ).toBe('single-line-text-value');

  // modal add
  await page.waitForSelector('.before-table-layout .add-btn');
  await page.click('.before-table-layout .add-btn');
  await page.waitForSelector('.basic-list-modal .ant-modal-title');
  expect(await page.$eval('.basic-list-modal .ant-modal-title', (el) => el.innerText)).toBe(
    'Test Add',
  );

  // invalid username
  await page.waitForSelector('.basic-list-modal #single_line_text');
  await page.type('.basic-list-modal #single_line_text', 'invalid');
  await page.type('.basic-list-modal #password', 'invalid');
  await page.waitForSelector('.basic-list-modal .submit-btn');
  await page.click('.basic-list-modal .submit-btn');
  await page.waitForSelector('.process-message span:nth-child(2)');
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Processing...',
  );
  await page.waitForTimeout(2000);
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Error Message.',
  );

  // valid username
  await page.type('.basic-list-modal #single_line_text', 'e2e');
  await page.type('.basic-list-modal #password', 'e2e');
  await page.waitForSelector('.basic-list-modal .submit-btn');
  await page.click('.basic-list-modal .submit-btn');
  await page.waitForSelector('.basic-list-table tbody tr:nth-child(1) td:nth-child(3)');
  expect(
    await page.$eval(
      '.basic-list-table tbody tr:nth-child(1) td:nth-child(3)',
      (el) => el.innerText,
    ),
  ).toBe('single-line-text-value');
  await page.waitForTimeout(2000);

  // modal edit
  await page.waitForSelector('.basic-list-table .edit-btn');
  await page.click('.basic-list-table .edit-btn');
  await page.waitForSelector('.basic-list-modal #single_line_text');
  expect(await page.$eval('.basic-list-modal #single_line_text', (el) => el.value)).toBe(
    'single-line-text-value',
  );
  await page.waitForSelector('.basic-list-modal .submit-btn');
  await page.click('.basic-list-modal .submit-btn');
  await page.waitForSelector('.process-message span:nth-child(2)');
  await page.waitForTimeout(1000);
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Edit successfully.',
  );
  await page.waitForTimeout(2000);

  // delete
  await page.click('.basic-list-table .delete-btn');
  await page.waitForTimeout(500);
  await page.waitForSelector('.batch-confirm-modal');
  await page.waitForSelector('.batch-overview-table');
  expect(await page.$eval('.batch-overview-table td:nth-child(2)', (el) => el.innerText)).toBe(
    'single-line-text-value',
  );
  await page.waitForSelector('.batch-confirm-modal .ant-btn-dangerous');
  await page.click('.batch-confirm-modal .ant-btn-dangerous');
  await page.waitForTimeout(500);
  expect(await page.$eval('.process-message span:nth-child(2)', (el) => el.innerText)).toBe(
    'Delete successfully.',
  );
  await page.waitForTimeout(1000);

  // batch delete
  await page.waitForSelector('.basic-list-table .ant-table-tbody .ant-checkbox-input:nth-child(1)');
  await page.click('.basic-list-table .ant-table-tbody .ant-checkbox-input:nth-child(1)');
  await page.waitForSelector('.batch-toolbar .delete-btn');
  await page.click('.batch-toolbar .delete-btn');
  await page.waitForSelector('.batch-confirm-modal');
  await page.waitForSelector('.batch-overview-table');
  expect(await page.$eval('.batch-overview-table td:nth-child(2)', (el) => el.innerText)).toBe(
    'single-line-text-value',
  );
  await page.waitForSelector('.batch-confirm-modal .ant-btn');
  await page.click('.batch-confirm-modal .ant-btn');
  await page.waitForTimeout(1000);

  // open search
  await page.waitForSelector('.before-table-layout .search-btn');
  await page.click('.before-table-layout .search-btn');
  await page.waitForTimeout(1000);
  await page.waitForSelector('.basic-list .search-layout');

  // check field exists
  await page.waitForSelector('.search-layout #single_line_text');
  expect((await page.$('.search-layout #password')) === null).toBeTruthy();
  await page.waitForSelector('.search-layout #multi_line_text');
  await page.waitForSelector('.search-layout #number');
  await page.waitForSelector('.search-layout #datetime');
  await page.waitForSelector('.search-layout #switch');
  await page.waitForSelector('.search-layout #radio');
  await page.waitForSelector('.search-layout #tree');
  await page.waitForSelector('.search-layout #parent');

  // go to trash
  await page.waitForSelector('.search-layout #trash');
  await page.click('.search-layout #trash');
  await page.waitForTimeout(500);
  await page.waitForSelector("div[title='Only Trashed']");
  await page.click("div[title='Only Trashed']");
  await page.waitForTimeout(1000);
  await page.waitForSelector('.search-layout .submit-btn');
  await page.click('.search-layout .submit-btn');
  await page.waitForTimeout(1000);
  await page.waitForSelector('.basic-list-table tbody tr:nth-child(1) td:nth-child(3)');
  expect(
    await page.$eval(
      '.basic-list-table tbody tr:nth-child(1) td:nth-child(3)',
      (el) => el.innerText,
    ),
  ).toBe('single-line-text-value');

  // search clear
  await page.waitForSelector('.search-layout .clear-btn');
  await page.click('.search-layout .clear-btn');
  await page.waitForTimeout(1000);
  await page.waitForSelector('.basic-list-table tbody tr:nth-child(1) td:nth-child(3)');
  expect(
    await page.$eval(
      '.basic-list-table tbody tr:nth-child(1) td:nth-child(3)',
      (el) => el.innerText,
    ),
  ).toBe('single-line-text-value');

  // close search
  await page.waitForSelector('.before-table-layout .search-btn');
  await page.click('.before-table-layout .search-btn');
  await page.waitForTimeout(1000);
  expect((await page.$('.basic-list .search-layout')) === null).toBeTruthy();

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
