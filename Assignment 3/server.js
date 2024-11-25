const express = require("express");
let server = express();

server.set("view engine","ejs");

server.use(express.static("Public"));

server.get("/",(req,res)=>{
  res.render("layout");
});

server.get("/about",(req,res)=>{
  res.render("portfolio");
});

server.listen(3000,()=>{
  console.log("Project started at localhost:3000");
})