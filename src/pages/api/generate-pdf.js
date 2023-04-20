import htmlPDF from "puppeteer-html-pdf";
import chromium from "chrome-aws-lambda";
export default async (req, res) => {
  if (req.method === "POST") {
    const { coverLetter, companyName, role } = req.body;
    const lines = coverLetter.split("\n");
    const openingLine = lines.shift();
    const closingLine = lines.pop();
    const content = lines.join("\n");
    try {
      const coverLetterHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            .page {
              position: absolute;
              top: 20px;
              right: 20px;
              bottom: 20px;
              left: 20px;
              border: 1px solid #000;
              box-sizing: border-box;
            }
            .cover-letter {
              display: flex;
              flex-direction: column;
              width: 100%;
              padding: 20px;
              box-sizing: border-box;
            } .cover-letter .opening-line {
                margin-bottom: 1rem;
              }
              .cover-letter .closing-line {
                margin-right: auto;
                margin-top: 2rem;
              } .content {
                white-space: pre-wrap;
              }
          </style>
        </head>
        <body>
        <div class="page">
        <div class="cover-letter">
          <div class="opening-line">${openingLine}</div>
          <div class="content">
            ${content}
          </div>
          <div class="closing-line">${closingLine}</div>
        </div>
      </div>
        </body>
        </html>
        `;

      const options = {
        format: "A4",
        headless: true,
        args: chromium.args,
        executablePath: await chromium.executablePath,
      };

      const pdfBuffer = await htmlPDF.create(coverLetterHTML, options);

      const fileName = `cover-letter-${companyName}-${role}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to generate the PDF." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
};
