var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
// body-parser extract the entire body portion of an incoming request stream and exposes it on req.body
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// __dirname refers to the directory that the script was running
// __dirname = /home/ubuntu/workspace/YelpCamp
app.use(methodOverride("_method"));
// seedDB(); //seed the db

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* console.log(req.user); >> esse comando puxa os dados do usuário, pode ser usado no header pra exibir/esconder os links de login/logout!
  se não tiver user logado, esse comando vai da undefined! mas quando o user loga, o req.user puxa .username e ._id */
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
}); // middleware

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function(){
   console.log("The YelpCamp Server Has Started!");
});
