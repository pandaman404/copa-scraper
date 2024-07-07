import playwright from 'playwright';
import { scrapeEuro } from './pages/euro2024';

async function scrapeTournamentData() {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await scrapeEuro(page);
  } catch (error) {
    console.error('Error en scrapeTournamentData:', error);
  } finally {
    await browser.close();
  }
}

scrapeTournamentData();
