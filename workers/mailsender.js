const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: "noreply.mailmev1@gmail.com",
    pass: process.env.PASS,
  },
});

const generateEmailTemplate = (data) => {
  const formatValue = (value) => {
    if (typeof value !== "string") return value;
    if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return `<a href="mailto:${value}">${value}</a>`;
    }
    if (value.match(/^https?:\/\/[^\s]+$/)) {
      return `<a href="${value}" target="_blank">${value}</a>`;
    }
    return value;
  };

  const buildTableRows = (obj) =>
    Object.entries(obj)
      .map(([key, value]) => {
        const label =
          key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
        return `
          <tr>
            <td class="label-cell">${label}</td>
            <td class="value-cell">${formatValue(value)}</td>
          </tr>`;
      })
      .join("");

  const submissionTable = buildTableRows(data);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Poppins', sans-serif;
      background: #f6f8fa;
      margin: 0;
      padding: 20px;
    }
    .email-wrapper {
      max-width: 640px;
      margin: auto;
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .email-header {
      background: linear-gradient(90deg, #004aad, #0077ff);
      color: #fff;
      padding: 20px;
      text-align: center;
    }
    .email-header h2 {
      margin: 0;
      font-size: 24px;
    }
    .email-section {
      padding: 25px 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #004aad;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .label-cell {
      width: 35%;
      padding: 10px;
      font-weight: 600;
      background: #f0f0f0;
      vertical-align: top;
    }
    .value-cell {
      padding: 10px;
      background: #fafafa;
    }
    .email-footer {
      padding: 15px;
      font-size: 13px;
      color: #777;
      background: #f0f0f0;
      text-align: center;
    }
    a {
      color: #004aad;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <h2>📬 New Form Submission</h2>
    </div>

    <div class="email-section">
      <div class="section-title">📄 Submission Details</div>
      <table>
        ${submissionTable}
      </table>
    </div>

    <div class="email-footer">
      This message was sent via your website form. Do not reply to this email.
    </div>
  </div>
</body>
</html>
`;
};

const sendEmail = async (mailTo, subject, rawMessage) => {
  const message = generateEmailTemplate(rawMessage);
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        to: mailTo,
        subject: subject,
        html: message,
      },
      (err, info) => {
        if (err) {
          console.error("❌ Email sending failed:", err);
          return reject(err);
        }
        return resolve(info);
      }
    );
  });
};

module.exports = { sendEmail, generateEmailTemplate };
