var express = require("express"),
    mongoose = require("mongoose"),
    // models
    User = require("./models/user"),
    app     = express();

// get rid of deprecation warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

var url = process.env.DATABASEURL || "mongodb://localhost/blog";
mongoose.connect(url);

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/blog", function(req, res){
    res.render("blog/blog");
});

// app.get("/blog/new", function(req, res){
//     res.render("blog/new");
// });

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Blog server started!!!");
});
