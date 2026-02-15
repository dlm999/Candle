import { test, expect } from '@playwright/test';

test.describe('Burning Candle App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Burning Candle App');
  });

  test('candle elements are rendered after initialization', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const candleWrapper = page.locator('.candle-wrapper');
    await expect(candleWrapper).toBeVisible();
    
    const candle = page.locator('.candle');
    await expect(candle).toBeVisible();
    
    const wick = page.locator('.wick');
    await expect(wick).toBeVisible();
    
    const flame = page.locator('.flame');
    await expect(flame).toBeVisible();
    
    const meltedWax = page.locator('.melted-wax');
    await expect(meltedWax).toBeVisible();
  });

  test('stopwatch is rendered with correct elements', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const stopwatchContainer = page.locator('.stopwatch-container');
    await expect(stopwatchContainer).toBeVisible();
    
    const stopwatchFace = page.locator('.stopwatch-face');
    await expect(stopwatchFace).toBeVisible();
    
    const stopwatchHand = page.locator('.stopwatch-hand');
    await expect(stopwatchHand).toBeVisible();
    
    const markings = page.locator('.mark');
    await expect(markings).toHaveCount(60);
    
    const majorMarkings = page.locator('.mark.major');
    await expect(majorMarkings).toHaveCount(12);
  });

  test('lighting animation plays on initial load', async ({ page }) => {
    const lighterContainer = page.locator('.lighter-container');
    await expect(lighterContainer).toBeVisible();
    
    const hand = page.locator('.hand');
    await expect(hand).toBeVisible();
    
    const taper = page.locator('.taper');
    await expect(taper).toBeVisible();
    
    const taperFlame = page.locator('.taper-flame');
    await expect(taperFlame).toBeVisible();
    
    await expect(lighterContainer).not.toBeVisible({ timeout: 6000 });
  });

  test('flame lights up after lighting animation', async ({ page }) => {
    const flame = page.locator('.flame');
    await expect(flame).toHaveClass(/out/);
    
    await page.waitForTimeout(2000);
    
    await expect(flame).not.toHaveClass(/out/);
  });

  test('stopwatch hand rotates during countdown', async ({ page }) => {
    await page.waitForTimeout(4500);
    
    const stopwatchHand = page.locator('.stopwatch-hand');
    const initialTransform = await stopwatchHand.evaluate(el => el.style.transform);
    
    await page.waitForTimeout(2000);
    
    const laterTransform = await stopwatchHand.evaluate(el => el.style.transform);
    expect(initialTransform).not.toBe(laterTransform);
  });

  test('candle shrinks during burn down', async ({ page }) => {
    await page.waitForTimeout(4500);
    
    const candle = page.locator('.candle');
    const initialTransform = await candle.evaluate(el => el.style.transform);
    
    await page.waitForTimeout(2000);
    
    const laterTransform = await candle.evaluate(el => el.style.transform);
    expect(initialTransform).not.toBe(laterTransform);
  });

  test('clicking stopwatch pauses the countdown', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const stopwatchContainer = page.locator('.stopwatch-container');
    const candleContainer = page.locator('.candle-container');
    const stopwatchHand = page.locator('.stopwatch-hand');
    
    const transformBeforePause = await stopwatchHand.evaluate(el => el.style.transform);
    
    await stopwatchContainer.click();
    
    await expect(candleContainer).toHaveClass(/paused/);
    
    await page.waitForTimeout(1000);
    
    const transformAfterPause = await stopwatchHand.evaluate(el => el.style.transform);
    expect(transformBeforePause).toBe(transformAfterPause);
  });

  test('clicking stopwatch resumes the countdown', async ({ page }) => {
    await page.waitForTimeout(5000);
    
    const stopwatchContainer = page.locator('.stopwatch-container');
    const candleContainer = page.locator('.candle-container');
    
    await stopwatchContainer.click();
    await expect(candleContainer).toHaveClass(/paused/);
    
    await stopwatchContainer.click();
    await expect(candleContainer).not.toHaveClass(/paused/);
    
    const stopwatchHand = page.locator('.stopwatch-hand');
    const transformBefore = await stopwatchHand.evaluate(el => el.style.transform);
    
    await page.waitForTimeout(1000);
    
    const transformAfter = await stopwatchHand.evaluate(el => el.style.transform);
    expect(transformBefore).not.toBe(transformAfter);
  });

  test('candle burns out after 10 seconds', async ({ page }) => {
    const flame = page.locator('.flame');
    const candle = page.locator('.candle');
    const candleContainer = page.locator('.candle-container');
    const stopwatchHand = page.locator('.stopwatch-hand');
    
    await page.waitForTimeout(5000);
    await expect(flame).not.toHaveClass(/out/);
    
    await page.waitForTimeout(6500);
    
    await expect(flame).toHaveClass(/out/);
    await expect(candleContainer).toHaveClass(/paused/);
    
    const candleTransform = await candle.evaluate(el => el.style.transform);
    expect(candleTransform).toBe('scaleY(0)');
    
    const handTransform = await stopwatchHand.evaluate(el => el.style.transform);
    expect(handTransform).toContain('rotate(360deg)');
  });

  test('clicking stopwatch after burn out resets the candle', async ({ page }) => {
    const stopwatchContainer = page.locator('.stopwatch-container');
    const flame = page.locator('.flame');
    const candle = page.locator('.candle');
    
    await page.waitForTimeout(12000);
    
    await expect(flame).toHaveClass(/out/);
    
    await stopwatchContainer.click();
    
    const lighterContainer = page.locator('.lighter-container');
    await expect(lighterContainer).toBeVisible();
    
    await page.waitForTimeout(2500);
    await expect(flame).not.toHaveClass(/out/);
    
    const candleTransform = await candle.evaluate(el => el.style.transform);
    expect(candleTransform).toBe('scaleY(1)');
  });

  test('sparks appear when candle is lit', async ({ page }) => {
    const sparks = page.locator('.spark');
    
    await expect(sparks).toHaveCount(0);
    
    await page.waitForTimeout(1500);
    
    await expect(sparks).toHaveCount(8);
    
    await page.waitForTimeout(1000);
    await expect(sparks).toHaveCount(0);
  });
});
