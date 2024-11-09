import puppeteer from "puppeteer";

// Scrape the links from the homepage in order
const scrapeLinksInOrder = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://webgpufundamentals.org/", {
    waitUntil: "networkidle2",
  });

  // Adjust the selector based on the structure of the site. Here, we assume the lessons are in 'a' tags under a list
  const urls = await page.evaluate(() =>
    Array.from(document.querySelectorAll('a[href*="/webgpu/lessons/"]')).map(
      (element) => element.href
    )
  );

  await browser.close();
  return urls;
};

// Convert a webpage to a PDF using Puppeteer
const convertPageToPdf = async (url, pageNumber) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.pdf({ path: `output/page-${pageNumber}.pdf`, format: "A4" });
  await browser.close();
};

// Main function
const main = async () => {
  const urls = await scrapeLinksInOrder();

  for (let i = 0; i < urls.length; i++) {
    console.log(`Converting: ${urls[i]}`);
    await convertPageToPdf(urls[i], i + 1);
  }

  console.log("All pages converted to PDFs!");
};

main();
