const express = require("express");
const router = express.Router();
const {userSignIn, userSignUp, userLogOut, verifyOtp, signUpOTP, userUpdate, resendOtp} = require("../controller/userCtrl");
const auth = require("../middleware/auth");

router.get("/verify", auth, (req, res) => {});
router.post("/signin", userSignIn);
router.post("/verifyotp", verifyOtp);
router.post("/signup", userSignUp);
router.post("/signupotp", signUpOTP)
router.post("/resend-otp", resendOtp);
router.put("/update", userUpdate);
router.get("/logout", userLogOut);



module.exports = router;