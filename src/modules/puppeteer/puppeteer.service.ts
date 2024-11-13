import { exec } from 'child_process';
import * as puppeteer from 'puppeteer';
import { promisify } from 'util';

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

const execAsync = promisify(exec);
@Injectable()
export class PuppeteerService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser;

  async onModuleInit() {
    try {
      const profileName = 'Default';
      const userDataDir = `/Users/phathdt/Library/Application Support/Google/Chrome`;

      await execAsync('pkill "Google Chrome"').catch(() => {});

      const chromeProcess = exec(
        `/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir="${userDataDir}" --profile-directory="${profileName}"`,
        (error) => {
          if (error) {
            console.error('Error launching Chrome:', error);
          }
        },
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));

      this.browser = await puppeteer.connect({
        browserURL: 'http://127.0.0.1:9222',
        defaultViewport: null,
      });

      console.log('Connected to Chrome with profile successfully');
      await this.runAutomationScript();
    } catch (error) {
      console.error('Failed to connect to Chrome:', error);
    }
  }

  async onModuleDestroy() {
    await this.browser?.disconnect();
  }

  private async runAutomationScript() {
    try {
      const page = await this.browser.newPage();

      while (true) {
        await page.setViewport({ width: 1280, height: 1024 });

        console.log('Navigating to website...');
        await page.goto(
          'https://www.tiktok.com/@juliahavy/photo/7435860660396870930?lang=vi-VN',
          {
            waitUntil: 'networkidle0',
          },
        );

        await page.goto(
          'https://www.tiktok.com/@juliahavy/video/7431572350392388881?lang=vi-VN',
          {
            waitUntil: 'networkidle0',
          },
        );

        console.log('Automation script completed successfully');
      }
    } catch (error) {
      console.error('Error during automation script:', error);
    }
  }
}
