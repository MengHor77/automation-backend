import { chromium } from "@playwright/test";

interface BrowserTestResult {
  success: boolean;
  message: string;
  title?: string;
}

export async function runBrowserTest(
  targetUrl: string,
  durationSeconds: number,
): Promise<BrowserTestResult> {
  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    const title = await page.title();

    await page.waitForTimeout(
      durationSeconds * 1000,
    );

    return {
      success: true,
      message:
        "Browser test completed successfully.",
      title,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Browser test failed.",
    };
  } finally {
    await browser.close();
  }
}