import puppeteer from 'puppeteer';
const BASE_URL = `http://localhost:${process.env.PORT || 8000}`;

beforeEach(async () => {});
afterEach(async () => {});

describe('ModelDesign', () => {
  it('model design', async () => {
    const browser = await puppeteer.launch({
      // headless: false,
      // slowMo: 20,
      timeout: 5000,
    });

    const page = await browser.newPage();
    await page.goto(`${BASE_URL}/user/login`);
    await page.waitForSelector('.ant-form');
    await page.type('#username', 'admin0');
    await page.type('#password', 'admin0');
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    await page.goto(`${BASE_URL}/basic-list/backend/models`);

    // Add
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForSelector('#add');
    await page.click('#add');
    await page.waitForSelector('.ant-modal-root');
    await page.waitForSelector('.ant-modal-content #title');
    await page.type('.ant-modal-content #title', 'Unit Test Model');
    await page.type('.ant-modal-content #name', 'unit_test_model');
    await page.click('.ant-modal-body .ant-btn.ant-btn-primary');
    await page.waitForTimeout(3000);
    expect(
      await page.$eval('tbody tr:nth-child(1) td:nth-child(3)', (node) => node.innerText),
    ).toBe('Unit Test Model');

    // Design
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(1000);
    await page.click('tbody div:nth-child(2) button:nth-child(1)');
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(1000);
    await page.waitForSelector('.ant-pro-footer-bar');
    await page.click("div[class='ant-pro-footer-bar'] div:nth-child(4) button:nth-child(1)");
    await page.waitForTimeout(2000);
    await page.waitForSelector("input[value='Edit']");
    await page.waitForSelector(
      "div[class='ant-pro-page-container-children-content'] div div:nth-child(2) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2)",
    );
    await page.click(
      "div[class='ant-pro-page-container-children-content'] div div:nth-child(2) div:nth-child(2) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(1) div:nth-child(2)",
    );
    await page.waitForTimeout(500);
    await page.type(
      'section.ant-layout:nth-child(3) main.ant-layout-content.ant-pro-basicLayout-content.ant-pro-basicLayout-has-header:nth-child(3) div.ant-pro-page-container div.ant-pro-grid-content div.ant-pro-grid-content-children div.ant-pro-page-container-children-content:nth-child(1) form.ant-form.ant-form-horizontal div.ant-card.ant-card-bordered.ant-card-small.sc-hMqMXs.jXnYCz:nth-child(2) div.ant-card-body div.ant-row.ant-form-item div.ant-col.ant-form-item-control div.ant-form-item-control-input div.ant-form-item-control-input-content div.sc-jKJlTe.gXckXX div.ant-table-wrapper div.ant-spin-nested-loading div.ant-spin-container div.ant-table div.ant-table-container div.ant-table-content tbody.ant-table-tbody:nth-child(3) tr.ant-table-row.ant-table-row-level-0 td.ant-table-cell:nth-child(2) div.ant-row.ant-form-item div.ant-col.ant-form-item-control div.ant-form-item-control-input div.ant-form-item-control-input-content > input.ant-input',
      'Name',
    );
    await page.type(
      'td.ant-table-cell:nth-child(3) > div.ant-row.ant-form-item:nth-child(1) > div.ant-col.ant-form-item-control:nth-child(1) > div.ant-form-item-control-input:nth-child(1) > div.ant-form-item-control-input-content:nth-child(1) > input',
      'name',
    );
    await page.waitForTimeout(500);
    await page.waitForSelector("button[type='submit']");
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    await page.goto(`${BASE_URL}/basic-list/backend/unit_test_models`);
    await page.waitForTimeout(2000);
    await page.waitForSelector('.ant-message-notice');

    // Delete
    await page.goto(`${BASE_URL}/basic-list/backend/models`);
    await page.waitForTimeout(2000);
    await page.waitForSelector('.ant-pro-page-container');
    await page.waitForTimeout(2000);
    await page.click('tbody div:nth-child(4) button:nth-child(1)');
    await page.waitForTimeout(2000);
    await page.click('.ant-modal-confirm-btns .ant-btn-dangerous');
    await page.waitForTimeout(500);
    await page.waitForSelector('.ant-message-notice');

    await page.close();
    browser.close();
  });
});
