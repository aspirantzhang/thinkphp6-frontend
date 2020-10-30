import puppeteer from 'puppeteer';
const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

beforeEach(async () => {});
afterEach(async () => {});

describe('BasicList', () => {
  it('basic list', async () => {
    const browser = await puppeteer.launch({
      headless: false,
      slowMo: 20,
      timeout: 5000,
    });

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/user/login`);
    await page.waitForSelector('.ant-form');
    await page.type('#username', 'admin0');
    await page.type('#password', 'admin0');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.goto(`${BASE_URL}/basic-list/backend/admins`);
    // Add
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForSelector('#add');
    await page.click('#add');
    await page.waitForSelector('.ant-modal-root');
    await page.waitForSelector('.ant-modal-content #username');
    await page.type('.ant-modal-content #username', 'unitTestUser');
    await page.type('.ant-modal-content #password', 'unitTestPass');
    await page.click('.ant-modal-body .ant-btn.ant-btn-primary');
    await page.waitForTimeout(3000);
    expect(
      await page.$eval('tbody tr:nth-child(1) td:nth-child(3)', (node) => node.innerText),
    ).toBe('unitTestUser');

    // // Modal Edit
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(2000);
    await page.click(
      'tbody tr:nth-child(1) td:nth-child(7) div:nth-child(1) div:nth-child(1) button:nth-child(1)',
    );
    await page.waitForTimeout(2000);
    expect(await page.$eval('.ant-modal-body #username', (node) => node.value)).toBe(
      'unitTestUser',
    );
    await page.type('.ant-modal-body #display_name', 'UserDisplayName');
    await page.click('.ant-modal-body .ant-btn.ant-btn-primary');
    await page.waitForTimeout(2000);
    expect(
      await page.$eval('tbody tr:nth-child(1) td:nth-child(4)', (node) => node.innerText),
    ).toBe('UserDisplayName');

    // Full page Edit
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(2000);
    await page.click(
      'tbody tr:nth-child(1) td:nth-child(7) div:nth-child(1) div:nth-child(2) button:nth-child(1)',
    );
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(1000);
    expect(await page.$eval('#username', (node) => node.value)).toBe('unitTestUser');
    await page.type('#display_name', '2');
    await page.waitForTimeout(1000);
    await page.click('.ant-pro-footer-bar-left .ant-btn-primary');
    await page.waitForTimeout(2000);
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(1000);
    expect(
      await page.$eval('tbody tr:nth-child(1) td:nth-child(4)', (node) => node.innerText),
    ).toBe('UserDisplayName2');

    // // Delete
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(2000);
    await page.click(
      'tbody tr:nth-child(1) td:nth-child(7) div:nth-child(1) div:nth-child(3) button:nth-child(1)',
    );
    await page.waitForTimeout(2000);
    await page.click('.ant-modal-confirm-btns .ant-btn-dangerous');
    await page.waitForTimeout(2000);
    expect(
      await page.$eval('tbody tr:nth-child(1) td:nth-child(3)', (node) => node.innerText),
    ).not.toBe('unitTestUser');

    // // Delete Permanently
    await page.waitForSelector('#searchExpandButton');
    await page.click('#searchExpandButton');
    await page.click('#trash');
    await page.waitForSelector("div[title='Only Trashed']");
    await page.waitForTimeout(2000);
    await page.click("div[title='Only Trashed']");
    await page.waitForTimeout(2000);
    await page.click('#searchSubmit');
    await page.waitForTimeout(2000);

    await page.waitForSelector('.ant-pro-page-container');

    await page.waitForTimeout(2000);

    await page.click(
      'tbody tr:nth-child(1) td:nth-child(1) label:nth-child(1) span:nth-child(1) input:nth-child(1)',
    );
    await page.waitForSelector("button[class='ant-btn ant-btn-danger']");
    await page.click("button[class='ant-btn ant-btn-danger']");
    await page.waitForTimeout(2000);
    await page.waitForSelector("button[class='ant-btn ant-btn-dangerous']");
    await page.click("button[class='ant-btn ant-btn-dangerous']");

    await page.close();
    browser.close();
  });
});
