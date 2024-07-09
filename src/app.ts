import playwright from 'playwright';
import { getRandom } from 'random-useragent';
import { scrapeEuro } from './pages/euro2024';

async function scrapeTournamentData() {
  // Random User Agent
  const agent = getRandom();
  let browser = null;

  try {
    // Abrir navegador
    browser = await playwright.chromium.launch();
    const context = await browser.newContext({ userAgent: agent });
    const page = await context.newPage();
    await scrapeEuro(page);
  } catch (error) {
    console.error('Error en scrapeTournamentData:', error);
  } finally {
    try {
      // Cerrar navegador
      await browser?.close();
    } catch (closeError) {
      console.error('Error al cerrar el navegador:', closeError);
    }
  }
}

scrapeTournamentData();
