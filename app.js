const bodyParser = require("body-parser");
const ejs = require("ejs");//required to embedd javascript. In other words, dynamically change html by sending data from server and filling in an html template
const express = require("express");
const util = require("util");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const app = express();
app.use(cookieParser());
app.use(express.static("public"));// allows inclusion of static files(css stylesheet). these files are not sent from our servers because the do not change.
app.use(bodyParser.urlencoded({extended:true}));//necessary to be able to retrieve user input from a form/post request.
app.set('view engine', 'ejs');//necessary to use embedded javascript
mongoose.connect("mongodb://localhost:27017/gleema-blogDB", {useNewUrlParser: true, useUnifiedTopology: true});
const aboutString = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor at auctor urna nunc id cursus metus aliquam. In metus vulputate eu scelerisque felis. Pulvinar pellentesque habitant morbi tristique senectus et. Fames ac turpis egestas integer eget aliquet nibh praesent. Mattis nunc sed blandit libero volutpat sed cras. Sagittis nisl rhoncus mattis rhoncus. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor at auctor urna nunc id cursus metus aliquam. In metus vulputate eu scelerisque felis. Pulvinar pellentesque habitant morbi tristique senectus et. Fames ac turpis egestas integer eget aliquet nibh praesent. Mattis nunc sed blandit libero volutpat sed cras. Sagittis nisl rhoncus mattis rhoncus. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor at auctor urna nunc id cursus metus aliquam. In metus vulputate eu scelerisque felis. Pulvinar pellentesque habitant morbi tristique senectus et. Fames ac turpis egestas integer eget aliquet nibh praesent. Mattis nunc sed blandit libero volutpat sed cras. Sagittis nisl rhoncus mattis rhoncus. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tortor at auctor urna nunc id cursus metus aliquam. In metus vulputate eu scelerisque felis. Pulvinar pellentesque habitant morbi tristique senectus et. Fames ac turpis egestas integer eget aliquet nibh praesent. Mattis nunc sed blandit libero volutpat sed cras. Sagittis nisl rhoncus mattis rhoncus. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna."
const blogSchema = new mongoose.Schema({
    postTitle: String,
    postImage: String,
    postBody: String,
    postType: String
});
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Posts = mongoose.model("post",blogSchema);
const Admin = mongoose.model("admin",adminSchema);
let user = {
  username: String,
  accessType: String
};
app.get("/",function(req, res){
  let message = "";
  if(req.cookies.userData !== undefined && req.cookies.userData.accessType === "admin"){
    message = "Logged in as Admin";
  }
  res.render("home",{logginMessage: message});
});
app.get("/:type",function(req,res){
  let message = "";
  let accessType = "entry";
  if(req.params.type !== "admin"){
    if(req.cookies.userData !== undefined && req.cookies.userData.accessType === "admin"){
        accessType = req.cookies.userData.accessType;
        message = "Logged in as Admin"
      }
      Posts.find({postType: req.params.type},function(err, results){
        if(err){
          console.log(err);
        }
        else{
          res.render("post",{imgSrc: "images/Gleema_Generic.jpg",about:aboutString,logginMessage:message,posts:results,postType: req.params.type,accessLevel: accessType});
        }
      });
}
else{
  res.render("loginPage");
}
});
app.post("/:type",function(req, res){
  // ------------------this part registers users-----------------
  // bcrypt.hash(req.body.password,saltRounds,function(err, hash){
  //   const newAdmin = new Admin({
  //     username: req.body.username,
  //     password: hash
  //   });
  //   newAdmin.save(function(err){
  //     if(err){
  //       res.send("there was an error in saving the user");
  //     }
  //     else{
  //       res.send("user sucessfully saved and hashed user");
  //     }
  //   });
  // });
  //-----------------this part logs in users------------------------
  if(req.params.type === "admin"){
  if(req.cookies.userData === undefined || req.cookies.userData.accessType !== "admin"){
  Admin.findOne({username: req.body.username},function(err, result){
    if(err){
      res.send(err);
    }
    else if(result){
      bcrypt.compare(req.body.password,result.password,function(err,passwordsMatch){
        if(passwordsMatch === true){
          user.username = req.body.username;
          user.accessType = "admin";
          res.cookie("userData",user);
          res.redirect("/");
        }
        else{
          res.send("wrong password");
        }
      });
    }
    else{
      res.send("wrong username or password");
    }
  });
}
else{
  res.redirect("/");
};
}
else{
  // create posts here based on the type
}
});














app.listen(3000,function(){
  console.log("listening on port 3000");
});
