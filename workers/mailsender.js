const nodemailer = require("nodemailer");
const axios = require("axios");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // upgrade later with STARTTLS
  auth: {
    user: "noreply.mailmev1@gmail.com",
    pass: process.env.PASS,
  },
});

// const generateEmailTemplate = (data) => {
//   const formatValue = (value) => {
//     if (typeof value !== "string") return value;
//     if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//       return `<a href="mailto:${value}">${value}</a>`;
//     }
//     if (value.match(/^https?:\/\/[^\s]+$/)) {
//       return `<a href="${value}" target="_blank">${value}</a>`;
//     }
//     return value;
//   };

//   const rows = Object.entries(data)
//     .map(([key, value]) => {
//       const label =
//         key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
//       return `
//       <tr>
//         <td class="label-cell">${label}:</td>
//         <td class="value-cell">${formatValue(value)}</td>
//       </tr>`;
//     })
//     .join("\n");

//   return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
//   <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
//   <style>
//     body {
//       font-family: 'Poppins', sans-serif;
//       background: #f6f8fa;
//       margin: 0;
//       padding: 30px 20px;
//       color: #333;
//     }
//     .email-wrapper {
//       max-width: 650px;
//       margin: auto;
//       background: #fff;
//       border-radius: 12px;
//       overflow: hidden;
//       box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
//       border: 1px solid #e0e0e0;
//     }
//     .email-header {
//       background: linear-gradient(90deg, #004aad, #0077ff);
//       padding: 25px 20px;
//       text-align: center;
//       color: #fff;
//     }
//     .email-header h2 {
//       margin: 0;
//       font-size: 26px;
//       font-weight: 600;
//     }
//     .email-content {
//       padding: 35px 30px;
//     }
//     table {
//       width: 100%;
//       border-collapse: collapse;
//     }
//     .label-cell {
//       font-weight: 600;
//       padding: 12px 8px;
//       color: #1a1a1a;
//       width: 35%;
//       vertical-align: top;
//     }
//     .value-cell {
//       padding: 12px 8px;
//       color: #444;
//     }
//     .email-footer {
//       background: #f1f1f1;
//       padding: 20px;
//       text-align: center;
//       font-size: 14px;
//       color: #777;
//     }
//     a {
//       color: #004aad;
//       text-decoration: none;
//       font-weight: 500;
//       transition: all 0.2s ease-in-out;
//     }
//     a:hover {
//       text-decoration: underline;
//       color: #002f6c;
//     }
//     @media only screen and (max-width: 600px) {
//       .email-content, .email-header, .email-footer {
//         padding: 20px;
//       }
//       .label-cell {
//         display: block;
//         width: 100%;
//         margin-top: 10px;
//         font-size: 15px;
//       }
//       .value-cell {
//         display: block;
//         width: 100%;
//         padding-bottom: 15px;
//         font-size: 14px;
//       }
//       table {
//         display: block;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="email-wrapper">
//     <div class="email-header">
//       <h2>📬 You Have a New Message</h2>
//     </div>
//     <div class="email-content">
//       <table>
//         ${rows}
//       </table>
//     </div>
//     <div class="email-footer">
//       You received this message from your website's form.<br>
//       <strong>Do not reply to this mail.</strong>
//     </div>
//   </div>
// </body>
// </html>
//   `;
// };

const generateEmailTemplate = (data, geoInfo = {}) => {
  const formatValue = (value) => {
    if (typeof value !== "string") return value;
    if (value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return `<a href="mailto:${value}">${value}</a>`;
    }
    if (value.match(/^https?:\/\/[^\s]+$/)) {
      return `<a href="${value}" target="_blank">${value}</a>`;
    }
    if (value.match(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/)) {
      return `<a href="https://www.google.com/maps?q=${value}" target="_blank">${value}</a>`;
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
  const geoTable =
    Object.keys(geoInfo).length > 0 ? buildTableRows(geoInfo) : "";

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

      ${
        geoTable
          ? `
        <div class="section-title">🌍 Sender Location Info</div>
        <table>
          ${geoTable}
        </table>`
          : ""
      }
    </div>

    <div class="email-footer">
      This message was sent via your website form. Do not reply to this email.
    </div>
  </div>
</body>
</html>
`;
};

const sendEmail = async (mailTo, subject, rawMessage, senderIpAddr) => {
  const senderGeoInfo = await getGeoInfo(senderIpAddr);
  const message = generateEmailTemplate(rawMessage, senderGeoInfo);
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
        // console.log("✅ Email sent:", info.response);
        return resolve(info);
      }
    );
  });
};

const getGeoInfo = async (ip) => {
  try {
    const res = await axios.get(`https://ipinfo.io/${ip}/json`);
    return {
      "ip Address": res.ip,
      City: res.city,
      State: res.region,
      Country: res.country,
    };
  } catch (err) {
    console.error("Geo lookup failed:", err.message);
    return null;
  }
};

module.exports = { sendEmail, generateEmailTemplate };
