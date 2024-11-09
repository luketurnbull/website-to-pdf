import { PDFDocument } from "pdf-lib";
import fs from "fs";

const splitPDFInHalf = async () => {
  const inputPDF = "your-pdf-file.pdf"; // Path to your input PDF

  // Read the PDF from the file system
  const pdfBytes = fs.readFileSync(inputPDF);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const totalPages = pdfDoc.getPageCount();

  // Determine the mid-point for splitting
  const midPoint = Math.ceil(totalPages / 2);

  // Create two new PDF documents for the two halves
  const firstHalfPDF = await PDFDocument.create();
  const secondHalfPDF = await PDFDocument.create();

  // Split the pages into two halves
  const firstHalfPages = await firstHalfPDF.copyPages(pdfDoc, [
    ...Array(midPoint).keys(),
  ]);
  const secondHalfPages = await secondHalfPDF.copyPages(
    pdfDoc,
    [...Array(totalPages - midPoint).keys()].map((n) => n + midPoint)
  );

  // Add the pages to their respective documents
  firstHalfPages.forEach((page) => firstHalfPDF.addPage(page));
  secondHalfPages.forEach((page) => secondHalfPDF.addPage(page));

  // Save the two halves as separate PDFs
  const firstHalfBytes = await firstHalfPDF.save();
  const secondHalfBytes = await secondHalfPDF.save();

  fs.writeFileSync("split-first-half.pdf", firstHalfBytes);
  fs.writeFileSync("split-second-half.pdf", secondHalfBytes);

  console.log(
    `PDF split into two parts: 'split-first-half.pdf' and 'split-second-half.pdf'`
  );
};

splitPDFInHalf();
