import type { Team, Tournament } from '../@types/tournament';
import type { Page } from 'playwright';
import { saveDataToJson } from '../utils/saveDataToJson';

const URL = 'https://www.uefa.com/euro2024/standings';

export async function scrapeEuro(page: Page): Promise<void> {
  try {
    console.info(`comienza scraping en: ${URL} `);
    await page.goto(URL, { waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('.GrMEzQSWHPskxEtEN1PP');

    const data = await page.evaluate(() => {
      const tournamentData: Tournament = {} as Tournament;
      const groups = document.querySelectorAll('.GrMEzQSWHPskxEtEN1PP');

      for (const group of groups) {
        const groupName = group.querySelector('h2.pk-text--text-01')?.textContent;

        if (groupName && groupName.length > 0) {
          tournamentData[groupName] = [];
          const countries = group.querySelectorAll('.ag-cell-wrapper');

          for (const country of countries) {
            const countryName = country.querySelector('.XiH7Q7qqQpsHxb_Z3I6N')?.getAttribute('title');
            const countryFlag = country.querySelector('.pk-badge')?.getAttribute('src');

            if (countryName && countryFlag) {
              const team: Team = { name: countryName, image: countryFlag };
              tournamentData[groupName].push(team);
            }
          }
        }
      }
      return tournamentData;
    });

    await saveDataToJson(data, 'euro_2024.json');
  } catch (error) {
    throw new Error('Error en scrapeEuro:' + error);
  }
}
