const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');
const upload = require('express-fileupload');
const cookie = require('cookie-parser');
const User_route = require('./Routes/User');
const Admin_route = require("./Routes/admin");
require("dotenv").config();

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(upload());
app.use(cookie());
app.use(express.static("public/"));
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:"123456ABCDsdfghj"
}));

app.use("/",User_route);
app.use("/admin",Admin_route);

app.listen(process.env.PORT || 1000);