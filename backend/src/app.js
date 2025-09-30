require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000;
require("./db/conn");
const path = require("path");
const userRoute = require("./routes/user");
const noteRoute = require("./routes/notes");
const oAuthRouter = require("./routes/OAuth");

app.use(express.static(path.join(__dirname, '../public')));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", userRoute);
app.use("/note/", noteRoute);
app.use("/auth/google/", oAuthRouter);
app.use("/", (req, res, next)=>{
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is started at port ${PORT}`);
})