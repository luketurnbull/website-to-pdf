import PDFMerger from "pdf-merger-js";
import fs from "fs";
import path from "path";

// Define the number of files per part
const FILES_PER_PART = 5; // Change this number as needed
const FILE_NAME = "WebGPU Fundamentals";

const mergePDFs = async () => {
  const outputFolder = "output"; // Folder where PDFs are stored
  const files = fs
    .readdirSync(outputFolder)
    .filter((file) => file.endsWith(".pdf"));

  let partNumber = 1;

  for (let i = 0; i < files.length; i += FILES_PER_PART) {
    const merger = new PDFMerger();

    // Get a chunk of files for this part
    const filesForPart = files.slice(i, i + FILES_PER_PART);

    // Add these files to the current merger
    for (const file of filesForPart) {
      await merger.add(path.join(outputFolder, file));
    }

    // Save the current part as a new PDF
    const outputFilePath = `${FILE_NAME}-${partNumber}.pdf`;
    await merger.save(outputFilePath);

    console.log(`Part ${partNumber} created: ${outputFilePath}`);
    partNumber++;
  }
};

mergePDFs();
