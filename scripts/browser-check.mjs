import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { startPreview } from './preview.mjs';

const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  process.env.LOCALAPPDATA && `${process.env.LOCALAPPDATA}/Google/Chrome/Application/chrome.exe`,
  process.env.PROGRAMFILES && `${process.env.PROGRAMFILES}/Google/Chrome/Application/chrome.exe`,
].filter(Boolean);
const executablePath = candidates.find((path) => fs.existsSync(path));
if (!executablePath) throw new Error('Chrome/Chromium is required. Set CHROME_PATH to its executable.');
const preview = await startPreview();
let browser;
try {
  browser = await chromium.launch({ executablePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1440 }, colorScheme: 'light', reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(preview.url);
  await page.getByRole('heading', { name: '为思想，选一种氛围。' }).waitFor();
  const style = () => page.locator('body').getAttribute('data-atelier-style');
  await page.getByRole('button', { name: '浅色主题: 青瓷造物', exact: true }).click();
  assert.equal(await style(), 'celadon');
  assert.equal(await page.locator('#new-session').evaluate((node) => getComputedStyle(node).backgroundColor), 'rgb(185, 83, 63)');
  assert.equal(await page.locator('#content-probe').evaluate((node) => getComputedStyle(node).backgroundColor), 'rgba(0, 0, 0, 0)');
  if (process.argv.includes('--screenshots')) {
    fs.mkdirSync(new URL('../docs/assets', import.meta.url), { recursive: true });
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.atelier-root').screenshot({ animations: 'disabled', path: fileURLToPath(new URL('../docs/assets/gallery-light.png', import.meta.url)) });
  }
  await page.getByRole('button', { name: '跟随系统', exact: true }).click();
  assert.equal(await style(), 'celadon');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.body.dataset.atelierStyle === 'midnight');
  await page.getByRole('button', { name: '深色主题: 黑白极简', exact: true }).click();
  assert.equal(await style(), 'mono');
  await page.getByRole('button', { name: '深色主题: 午夜霓虹', exact: true }).click();
  await page.evaluate(async () => {
    window.atelierPreview.theme.setFontSize('text', 18);
    window.atelierPreview.theme.setFontFamily('code', 'Menlo');
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
  assert.equal(await style(), 'midnight');
  assert.equal(await page.locator('#font-probe').evaluate((node) => getComputedStyle(node).fontSize), '18px');
  if (process.argv.includes('--screenshots')) {
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.atelier-root').screenshot({ animations: 'disabled', path: fileURLToPath(new URL('../docs/assets/gallery-dark.png', import.meta.url)) });
  }
  await page.reload();
  await page.locator('.atelier-root').waitFor();
  assert.equal(await style(), 'midnight');
  await page.getByRole('button', { name: '原生浅色', exact: true }).click();
  assert.equal(await style(), null);
  assert.equal(await page.locator('.atelier-current-name').innerText(), 'DSH 原生');
  await page.getByRole('button', { name: '浅色主题: 纸上花园', exact: true }).click();
  await page.getByRole('button', { name: '恢复原生', exact: true }).click();
  assert.equal(await style(), null);
  assert.equal(await page.evaluate(() => window.atelierPreview.theme.getTheme().preference), 'light');
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const filter = page.getByRole('group', { name: '筛选风格', exact: true });
  await filter.getByRole('button', { name: '深色', exact: true }).click();
  assert.equal(await page.locator('.atelier-card').count(), 3);
  await filter.getByRole('button', { name: '全部风格', exact: true }).focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.atelier-card').count(), 6);
  const english = await context.newPage();
  await english.goto(`${preview.url}/?lang=en`);
  await english.getByRole('heading', { name: 'Choose your atmosphere.' }).waitFor();
  assert.ok(!(await english.locator('.atelier-root').innerText()).includes('styles.'));
  assert.deepEqual(errors, []);
  console.log('PASS browser: six styles, rc.5 selectors, native takeover, reset, system pairing, reload, fonts, mobile layout, keyboard, English');
} finally {
  await browser?.close();
  await preview.close();
}
