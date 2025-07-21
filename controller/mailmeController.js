const sendEmail = require("../workers/mailsender").sendEmail;

const sendMail = async (req, res) => {
  const mailto = req.params.mailto;
  const subject = req.query.subject || "";
  const data = req.body;
  const senderIpAddr =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip;

  try {
    await sendEmail(mailto, subject, data, senderIpAddr);

    return res.status(200).json({ message: "Submitted successfully ✅" });
  } catch (error) {
    console.error("❌ Error sending email:", error.message || error);

    return res.status(500).json({
      message: "Failed to send email",
      error: error.message || "Unknown error",
    });
  }
};

module.exports = { sendMail };
