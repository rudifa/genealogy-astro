/**
 * Prepares an SVG for printing by embedding it in a hidden iframe
 * and triggering the browser's print dialog.
 * @param {string} svgContent - The outerHTML of the SVG element to print.
 * @param {string} pageTitle - The title for the printed page.
 */
export function printGraph(svgContent, pageTitle = "Genealogy Graph") {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.close();

  // Set the HTML content directly on the documentElement
  const htmlContent = `
    <head>
      <title>${pageTitle}</title>
      <style>
        @media print {
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
          svg {
            max-width: 100%;
            max-height: 100vh;
            width: auto;
            height: auto;
            display: block;
          }
        }
      </style>
    </head>
    <body>
      ${svgContent}
    </body>
  `;
  doc.documentElement.innerHTML = htmlContent;

  iframe.contentWindow.focus();
  iframe.contentWindow.print();

  // Clean up the iframe after printing
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
}
