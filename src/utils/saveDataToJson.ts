import fs from 'fs';
import path from 'path';

export async function saveDataToJson(data: unknown, fileName: string) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    const filePath = path.resolve(__dirname, '..', 'data', fileName);

    fs.writeFileSync(filePath, jsonData);
    console.info(`Datos guardados correctamente en: ${filePath}`);
  } catch (error) {
    console.error('Error al guardar datos en JSON:', error);
    throw error;
  }
}
