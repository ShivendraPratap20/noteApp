const userModel = require("../db/model/userModel");
const otpModel = require("../db/model/otpModel");
const sendOTP = require("../utils/sendOtp");
const bcrypt = require("bcryptjs");

const userSignIn = async (req, res) => {
  try {
    const { userID, password } = req.body;
    const userData = await userModel.find({ userID: userID });
    if (userData[0] == undefined) {
      res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
      return;
    }
    const isMatch = await bcrypt.compare(password, userData[0].password);
    if (!isMatch) {
      res.status(404).json({ status: "FAILED", message: "Password Incorrect" });
      return;
    }
    const plainOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(plainOtp, 10);
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await otpModel.deleteMany({ userID: userData[0]._id, purpose: 'signin', used: false });
    await otpModel.create({
      userID: userData[0].userID,
      otp: hashedOtp,
      purpose: 'signin',
      expiresAt
    });
    await sendOTP({ email: userData[0].userID, phone: userData[0].phoneNumber, otp: plainOtp });
    res.status(200).json({ status: "SUCCESS", message: "OTP sent" });
  } catch (error) {
    console.log(`Error while singing in ${error}`);
    res.status(500).send({ status: "FAILED", message: 'Internal server error' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userID, otp } = req.body;
    if (!userID || !otp) {
      return res.status(400).json({ status: "FAILED", message: "userId and OTP are required" });
    }
    const userData = await userModel.find({ userID: userID });
    const record = await otpModel.findOne({ userID: userData[0].userID, purpose: "signin", used: false })
      .sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ status: "FAILED", message: "OTP not found or already used" });
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ status: "FAILED", message: "OTP has expired" });
    }
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ status: "FAILED", message: "Invalid OTP" });
    }
    record.used = true;
    await record.save();
    const token = await userData[0].generateToken();
    console.log(token);
    res.cookie("JWT", token, {
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.status(202).json({ status: "SUCCESS", message: "Login Success", userData: userData[0] });
  } catch (err) {
    console.error("verify-otp error:", err);
    return res.status(500).json({ status: "FAILED", message: "Server error" });
  }
};


const userSignUp = async (req, res) => {
  try {
    const { userName, userID, phoneNumber, password, confirmPassword } = req.body;
    const existsData = await userModel.find({ userID: userID });
    if (existsData[0] != undefined) {
      res.status(409).json({ status: "FAILED", message: "User already exixts" });
      return;
    }
    if (password !== confirmPassword || password.length < 8) {
      res.status(401).json({ status: "FAILED", message: "Check your password or confirm password" });
      return;
    }
    const plainOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(plainOtp, 10);
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await otpModel.deleteMany({ userID: userID, purpose: 'signin', used: false });
    await otpModel.create({
      userID: userID,
      otp: hashedOtp,
      purpose: 'signin',
      userName,
      password,
      phoneNumber,
      expiresAt
    });
    await sendOTP({ email: userID, phone: phoneNumber, otp: plainOtp });
    res.status(200).json({ status: "SUCCESS", message: "OTP sent" });
  }
  catch (error) {
    console.log(`Error while creating new accout ${error}`);
    res.status(505).json({ status: "FAILED", message: ' Internal server error' });
  }
};

const signUpOTP = async (req, res) => {
  try {
    const { userID, otp } = req.body;
    console.log(userID);
    if (!userID || !otp) {
      return res.status(400).json({ status: "FAILED", message: "userId and OTP are required" });
    }
    const tempUserData = await otpModel.find({ userID: userID });
    const record = await otpModel.findOne({ userID: tempUserData[0].userID, purpose: "signin", used: false })
      .sort({ createdAt: -1 });

    if (!record) {
      return res.status(400).json({ status: "FAILED", message: "OTP not found or already used" });
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ status: "FAILED", message: "OTP has expired" });
    }
    const isMatch = await bcrypt.compare(otp, record.otp);
    if (!isMatch) {
      return res.status(400).json({ status: "FAILED", message: "Invalid OTP" });
    }
    record.used = true;
    await record.save();
    const result = new userModel({
      userName: record.userName,
      userID: record.userID,
      phoneNumber: record.phoneNumber,
      password: record.password
    }
    );
    const data = await result.save();
    console.log(data);
    const token = await data.generateToken();
    console.log(token);
    res.cookie("JWT", token, {
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000
    });
    res.status(202).json({ status: "SUCCESS", message: "Login Success", userData: data[0] });
  } catch (error) {
    console.log(`Error occured while OTP verify during registration ${error}`);
    res.status(500).json({ status: "FAILED", message: "Server Error" });
  }
};

const resendOtp = async(req, res) => {
  try {
    const { email } = req.body;
    const userData = await userModel.find({ userID: email });
    if (userData[0] == undefined) {
      res.status(404).json({ status: "FAILED", message: "User doesn't exists" });
      return;
    }
    const plainOtp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedOtp = await bcrypt.hash(plainOtp, 10);
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);
    await otpModel.deleteMany({ userID: userData[0]._id, purpose: 'signin', used: false });
    await otpModel.create({
      userID: userData[0].userID,
      otp: hashedOtp,
      purpose: 'signin',
      expiresAt
    });
    await sendOTP({ email: userData[0].userID, phone: userData[0].phoneNumber, otp: plainOtp });
    res.status(200).json({ status: "SUCCESS", message: "OTP sent" });
  } catch (error) {
    console.log(`Error in resending OTP ${error}`);
    res.status(500).json({ status: "FAILED", message: "Server error" });
  }
}

const userLogOut = (req, res) => {
  try {
    console.log(req.cookies.JWT);
    res.clearCookie("JWT");
    res.status(200).json({ status: "SUCCESS", message: "Logout" });
  } catch (error) {
    console.log("Error occured while logout " + error);
    res.json({ status: "FAILED", message: "Internal server error" });
  }
};

const userUpdate = async (req, res) => {
  try {
    console.log(req.body);
    const { userID, oldUserID, userName, phoneNumber } = req.body;
    const user = await userModel.findOne({ userID: oldUserID });
    if (!user) {
      res.status(404).json({ status: "FAILED", message: "User not found" });
    }
    const updatedUser = await userModel.findOneAndUpdate(
      { userID: oldUserID },
      {
        userID: userID,
        userName,
        phoneNumber
      },
      { new: true }
    );
    res.status(202).json({ status: "SUCCESS", data: updatedUser })
  } catch (error) {
    console.log("Error while updating the user" + error);
    res.json({ status: "FAILED", message: "Internal server error" });
  }
};

module.exports = {
  userSignIn,
  userSignUp,
  userLogOut,
  verifyOtp,
  signUpOTP,
  resendOtp,
  userUpdate
}