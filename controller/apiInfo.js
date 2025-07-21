const { generateEmailTemplate } = require("../workers/mailsender");

const checkMailService = async () => {
  try {
    const test = generateEmailTemplate({ test: "ping" });
    return true;
  } catch {
    return false;
  }
};

const apiInfo = async (req, res) => {
  const isServiceActive = await checkMailService();

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>📫 MailMe API Docs</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; background: #fff; }
        th, td { border: 1px solid #ddd; padding: 10px; }
        th { background: #eee; }
        code { background: #eee; padding: 2px 5px; border-radius: 4px; }
        .example { background: #fff; padding: 15px; border-left: 5px solid #2196f3; font-family: monospace; white-space: pre-wrap; }
        .footer { margin-top: 40px; text-align: center; font-size: 0.9em; color: #777; }
        .status { float: right; font-size: 0.9em; color: ${
          isServiceActive ? "#4CAF50" : "#f44336"
        }; }
      </style>
    </head>
    <body>
      <h1>📫 MailMe API – Docs <span class="status">Service: ${
        isServiceActive ? "✅ Active" : "❌ Offline"
      }</span></h1>

      <h2>📍 Endpoint</h2>
      <table>
        <tr><th>Route</th><th>Method</th><th>Description</th></tr>
        <tr>
          <td><code>/mailme/:mailto</code></td>
          <td>POST</td>
          <td>Sends a contact form (dynamic body) to the given email address</td>
        </tr>
      </table>

      <h2>🔑 Query Parameters</h2>
      <table>
        <tr><th>Name</th><th>Required</th><th>Description</th></tr>
        <tr>
          <td><code>subject</code></td>
          <td>No</td>
          <td>Optional email subject</td>
        </tr>
      </table>

      <h2>📤 Request Body (Dynamic JSON)</h2>
      <p>You can send any JSON fields. Example:</p>
      <div class="example">
{
  "full_name": "Aman Vishwakarma",
  "email": "me.amanvishwakarma@gmail.com",
  "message": "I'm interested in your services.",
  "company": "Media.net",
  "budget": "$5000+",
  "country": "India"
}
      </div>

      <h2>🌍 Auto-collected Geolocation Info</h2>
      <p>The following details are auto-inferred from the request:</p>
      <table>
        <tr><th>Field</th><th>Description</th></tr>
        <tr><td><code>ip</code></td><td>User's public IP address</td></tr>
        <tr><td><code>city</code></td><td>Approximate city from IP</td></tr>
        <tr><td><code>region/state</code></td><td>Approximate region/state</td></tr>
        <tr><td><code>country</code></td><td>Country name</td></tr>
        <tr><td><code>timezone</code></td><td>Timezone of the IP address</td></tr>
      </table>

      <p>This data is automatically appended and visible in the email (in a separate section).</p>

      <h2>✅ Sample Response</h2>
      <table>
        <tr><th>Status</th><th>Message</th></tr>
        <tr><td>200</td><td><code>{"message": "Submitted successfully ✅"}</code></td></tr>
        <tr><td>500</td><td><code>{"message": "Failed to send email", "error": "Reason"}</code></td></tr>
      </table>

      <div class="footer">
        <p>🇮🇳 Made with ❤️ in India</p>
        <p><strong>Disclaimer:</strong> This API is built for educational and experimental use only.</p>
      </div>
    </body>
    </html>
  `);
};

module.exports = { apiInfo };
