export const htmlIdCardTemplate = (obj: Record<string, any>) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <style>
          body {
              font-family: Arial, Helvetica, sans-serif;
              margin: 0;
              padding: 0;
          }
          .card {
              box-shadow: 0 8px 8px 10px rgba(87, 84, 84, 0.4);
              max-width: 250px;
              padding: 10px;
              margin: auto;
              text-align: center;
          }
          .avatar {
              width: 130px;
              height: 130px;
              border: 4px solid black;
              border-radius: 50%;
              font-size: 100px;
              margin: auto;
          }
          .designation {
              font-size: 18px;
          }
      </style>
  </head>
  <body>
      <h1 style="text-align: center;">Identity Card</h1>
      <div class="card">
          <div class="avatar">
              [Image should be here?]
          </div>
          <h1>[My name should be here?]</h1>
          <div class="designation">
              [My Gender should be here?]
          </div>
          ${Object.entries(obj)
            .map(([k, v]) => `<p>${k}:</p><p>${v}</p><br><br>`)
            .join('')}
      </div>
  </body>
  </html>
  `;
};
