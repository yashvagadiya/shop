const express = require("express");
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const userRoute = require(`./routers/userRoute`)
const authRoute = require(`./routers/authRoute`)



app.use("/auth",authRoute);
app.use("/user",userRoute);



app.listen(8000,()=>{
    console.log("port start at 8000....." );
});