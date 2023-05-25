const nodeFetch = require('node-fetch');

export async function downloadImageAsBuffer(url: string) {
  try {
    const response = await nodeFetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer;
  } catch (error) {
    console.error('Error downloading the image:', error);
    return null;
  }
}

export function bufferToBlob(buffer: Buffer, mimeType: string): Blob {
  return new Blob([buffer], { type: mimeType });
}
  