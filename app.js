if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// Requiring the dependencies
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require("method-override");
const session = require('express-session');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const UserRoutes = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp'

// mongodb://127.0.0.1:27017/yelp-camp
mongoose.connect(dbUrl).then(() => {
  console.log("Mongo Connected!");
})


const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
];
//This is the array that needs added to
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dftxgkn0d/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.MONGO_SECRET,
  },
  touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
})
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(mongoSanitize());
const sessionConfig = {
  store: store,
  // secret name for replacing the connect.sid, so its difficult to gain access
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7),// week expiry
    maxAge: (1000 * 60 * 60 * 24 * 7)
  }
}
app.use(session(sessionConfig));
// App. Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Calling flash to display message!
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})
// the general routes for both:
app.use('/', UserRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// '/' route:
app.get("/", (req, res) => {
  res.render("home");
});

// Any False Request
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found!", 404));
});

// Default Error Handler
app.use((error, req, res, next) => {
  const { statusCode = 500 } = error;
  if (!error.message) error.message = "Oh no! Something went wrong!";
  res.status(statusCode).render('error', { error });
});

// Connect to port 3000
app.listen(3000, () => {
  console.log("Listening Port 3000");
});
