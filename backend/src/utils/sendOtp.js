const nodemailer = require("nodemailer");

const sendOTP = async ({ email, phone, otp }) => {
  try {
    if (email) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 3 minutes.`,
      });
      console.log(`OTP email sent to ${email}`);
    }
  } catch (err) {
    console.error("Error sending OTP:", err);
    return { status: "FAILED", error: err.message };
  }
};

module.exports = sendOTP;
