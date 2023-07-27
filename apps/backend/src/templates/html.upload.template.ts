export const htmlUploadTemplate = (obj: Record<string, any>) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
        <style>
            body {
            font-size: 8px;
            }
            .list {
            padding: 10px;
            }
        </style>
    </head>
    <body>
        <div class="list">
            ${Object.entries(obj)
              .map(([k, v]) => `<p>${k}:</p><p>${v}</p><br>`)
              .join('')}
        </div>
    </body>
    </html>
    `;
};
