require("dotenv").config();
const express = require('express');
const cors = require('cors');
const connect=require('../db');

const app = express();
const PORT = process.env.PORT || 5000;
const authRouter = require('./Auth/auth.route')
const productRouter = require("./Product/Product.route")


app.use(express.urlencoded({ extended: true }));
app.use(cors({origin:true,credentials:true}));
app.use(express.json()); 

app.use("/user",authRouter);   
app.use("/user",productRouter);   

app.get("/",(req,res)=>{
  res.send("hello world!_ its working now");
});




app.listen(PORT, async() => {
  await connect()
  console.log(`Server listening on port : http://localhost:${PORT}`);
});
