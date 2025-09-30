const jwt = require("jsonwebtoken");
const UserModel = require("../db/model/userModel");

const auth = async (req, res, next)=>{
    try {
        const userToken = req.cookies.JWT;
        if(userToken == undefined) 
            throw new Error("Undefined token");
        const {_id, iat} = jwt.verify(userToken, process.env.SECRET_KEY);
        const userID = _id;
        const userData = await UserModel.find({ _id: userID });
        res.json({status:"AUTHORIZED", data:userData}); 
        next();
    } catch (error) {
        console.log(`Can't authenticate ${error}`);
        res.status(401).send({status:"UNAUTHORIZED"});
    }   
   
};
module.exports = auth;