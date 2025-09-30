const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SG_EMAIL_PASS);

const sendOTP = async ({ email, otp }) => {
  try {
    const msg = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 3 minutes.`,
    };

    await sgMail.send(msg);
    console.log(`OTP email sent to ${email}`);
    return { status: "SUCCESS", message: "OTP sent" };
  } catch (err) {
    console.error("Error sending OTP:", err);
    return { status: "FAILED", message: "Server error" };
  }
};

module.exports = sendOTP;
