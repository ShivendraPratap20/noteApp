const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("../config/passport");
const userModel = require("../db/model/userModel");

router.get("/", passport.authenticate("google", {scope:["profile", "email"]}))
router.get("/callback", 

    passport.authenticate("google", {session:false}),
    async (req, res)=>{
        try {
            const token = jwt.sign({_id:req.user._id, userID:req.user.userID}, process.env.SECRET_KEY);
            res.cookie("JWT", token);
            const userData = await userModel.find({ userID: req.user.userID });
            res.redirect(`${process.env.CLIENT_URL}/dashboard`)
        } catch (error) {
            console.error("Google login error:", error)
            res.redirect(`${process.env.CLIENT_URL}/`)
        }
    }
);

module.exports = router;