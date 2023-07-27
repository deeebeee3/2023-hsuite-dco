import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { PDFDocument } from 'pdf-lib';
import * as htmlToPdf from 'html-pdf';

const scrypt = promisify(_scrypt);

export const hashAndSalt = async (
  thingToHash: string | Uint8Array,
): Promise<string> => {
  const salt = randomBytes(8).toString('hex');

  const hash = (await scrypt(thingToHash, salt, 32)) as Buffer;

  const result = `${salt}.${hash.toString('hex')}`;

  return result;
};

export const generatePdfFromHtml = async (
  html: string,
): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    htmlToPdf.create(html).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
};

export const generatePdf = async (html: string): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();
  const htmlPdfBytes = await generatePdfFromHtml(html);
  const htmlPdf = await PDFDocument.load(htmlPdfBytes);
  const [htmlPdfPage] = await pdfDoc.copyPages(htmlPdf, [0]);
  pdfDoc.addPage(htmlPdfPage);

  return await pdfDoc.save();
};
