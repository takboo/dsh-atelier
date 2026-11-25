import assert from 'node:assert/strict';

export async function prepareClient(page) {
  // The rc.5 default Web profile shows two first-run dialogs in a fresh profile.
  const welcome = page.getByRole('dialog').filter({ has: page.getByRole('button', { name: /^(Continue|继续)$/ }) });
  await welcome.getByRole('button', { name: /^(Continue|继续)$/ }).click();
  const signIn = page.getByRole('dialog', { name: /^(Get started|开始使用)$/ });
  await signIn.getByRole('button', { name: /^(Close|关闭)$/ }).click();
  await signIn.waitFor({ state: 'hidden' });
}

export async function verifyClient(page) {
  const stylesheet = page.locator('style[data-plugin="@takboo/dsh-atelier"]');
  await stylesheet.waitFor({ state: 'attached' });

  await page.getByRole('button', { name: /^(Atelier|风格画廊)$/ }).click();
  const gallery = page.locator('.atelier-root');
  await gallery.waitFor();
  assert.equal(await gallery.locator('.atelier-card').count(), 6);

  await gallery.getByRole('button', { name: /Celadon Studio|青瓷造物/ }).click();
  await page.waitForFunction(() => document.body.dataset.atelierStyle === 'celadon');
  await gallery.getByRole('button', { name: /^(Restore native|恢复原生)$/ }).click();
  await page.waitForFunction(() => !document.body.dataset.atelierStyle);
  return ['client stylesheet mounted', 'six gallery styles rendered', 'Celadon applied', 'native appearance restored'];
}
