import type { Team, Tournament } from '../@types/tournament';
import type { Page } from 'playwright';
import { saveDataToJson } from '../utils/saveDataToJson';

const URL_BASE = 'https://copaamerica.com';

export async function scrapeCopaAmerica(page: Page): Promise<void> {
  try {
    console.info(`Comienza scraping en: ${URL_BASE}/en/groups`);
    await page.goto(`${URL_BASE}/en/groups`, { waitUntil: 'load', timeout: 0 });
    await page.waitForSelector('div.col-span-full.bg-white.rounded-xl.lg\\:col-span-6.border');

    const data = await page.evaluate((URL) => {
      const tournamentData: Tournament = {};
      const groups = document.querySelectorAll('div.col-span-full.bg-white.rounded-xl.lg\\:col-span-6.border');

      groups.forEach((group) => {
        const groupName = group.querySelector('h3.font-display.font-semibold.text-2xl.capitalize')?.textContent;

        if (groupName && groupName.length > 0) {
          const capitalizedGroupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
          tournamentData[capitalizedGroupName] = [];
          const countries = group.querySelectorAll('div.team-flag img');

          countries.forEach((country) => {
            const countryName = country.getAttribute('alt');
            const countryFlag = country.getAttribute('src');

            if (countryName && countryFlag) {
              const team: Team = { name: countryName, image: URL + countryFlag };
              tournamentData[capitalizedGroupName].push(team);
            }
          });
        }
      });

      return tournamentData;
    }, URL_BASE);

    await saveDataToJson(data, 'copa_america_2024.json');
  } catch (error) {
    throw new Error('Error en scrapeCopaAmerica: ' + error);
  }
}
