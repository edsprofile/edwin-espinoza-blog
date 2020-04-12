require('dotenv').config()

var express = require("express"),
    helmet = require("helmet"),
    sessions = require("client-sessions"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    // models
    User = require("./models/user"),
    Post = require("./models/post"),
    app = express();

// get rid of deprecation warnings
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useCreateIndex", true);

var url = process.env.DATABASEURL || "mongodb://localhost/blog";
mongoose.connect(url);

app.set("view engine", "ejs");
app.use(helmet());
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))

app.use(sessions({
    cookieName: "session",
    secret: process.env.SUPERSECRET,
    duration: 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// app.get("/signup", function(req, res){
//     res.render("signup");
// });

// app.post("/signup", function(req, res){
//     var newUser = new User({username:req.body.username, email: req.body.email});
//     User.register(newUser, req.body.password, function(err, createdUser){
//         if(err){
//             console.log(err)
//             console.log("ERROR CREATING USER!!!")
//             return res.render("/signup");
//         }
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/")
//         })
//     })
// });

app.get("/frontdoor", function(req, res){
    res.render("login");
});

app.post("/frontdoor", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/frontdoor",
}), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/", function(req, res){
    res.render("landing");
});

// Index route for blogs
app.get("/blog", function(req, res){
    Post.find({}, function(err, allPost){
        if(err){
            console.log(err);
            console.log("There was an error in the INDEX route");
        }
        else{
            res.render("blog/blog", {posts: allPost});
        }
    });
});

// NEW route
app.get("/blog/new", function(req, res){
    res.render("blog/new");
});

// CREATE route
app.post("/blog", function(req, res){
    var title = req.body.title;
    var description = req.body.description;
    var image = req.body.image;
    var content = req.body.content;
    var createdAt = req.body.createdAt;
    var newPost = {title: title, description: description, image: image, content: content, createdAt: createdAt};
    Post.create(newPost, function(err, createdPost){
        if(err){
            console.log(err);
            console.log("There was an ERROR in the CREATE route.");
        }
        else{
            console.log(createdPost);
            res.redirect("/blog");
        }
    });
});

// SHOW ROUTE
app.get("/blog/:id", function(req, res){
    Post.findById(req.params.id).exec(function(err, foundPost){
        if(err){
            console.log(err);
            console.log("Error in the SHOW route");
        }
        else{
            res.render("blog/show", {post: foundPost});
        }
    });

});

// EDIT ROUTE
app.get("/blog/:id/edit", function(req, res){
    Post.findById(req.params.id).exec(function(err, foundPost){
        if(err){
            console.log(err);
            console.log("Error in the EDIT route");
        }
        else{
            res.render("blog/edit", {post: foundPost});
        }
    });
});

// UPDATE ROUTE
app.put("/blog/:id", function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
            console.log("Error in the PUT route");
        }
        else{
            res.redirect("/blog/" + updatedBlog._id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blog/:id", function(req, res){
    Post.findByIdAndDelete(req.params.id, req.body.blog, function(err, deletedBlog){
        if(err){
            console.log(err);
            console.log("Error in th DELETE route");
        }
        else{
            res.redirect("/blog/");
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log("Blog server started!!!");
});
