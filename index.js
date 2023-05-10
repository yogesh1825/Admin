const express = require("express");
const app = express();
var GoogleStrategy = require("passport-google-oauth20").Strategy;

require("dotenv").config();
const cookiesparser = require("cookie-parser");
const connect = require("./config/db");
const user = require("./models/user");
const session = require("express-session");
const passport = require("passport");
const passportAuth = require("./Middlewares/passauth");
const isAuth = require("./Middlewares/auth");
const googleAuth = require("./Middlewares/googleauth");


app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookiesparser());
let day = 24 * 60 * 30 * 60 * 5 * 1000;
app.use(session({ secret: "yogesh" }));









passport.use(new GoogleStrategy({
  clientID: "386296331016-ghn515lpkp3jt96hbbdmk29fj5ni85pn.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "http://localhost:8080/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
 
    return cb(profile);
  
}
));





// passport js 

passport.serializeUser((user, done) => {
  return done(null, user);
});
passport.deserializeUser((user, done) => {
  return done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());
app.set("views", __dirname + "/views");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  console.log(req.user);
  res.render("dash");
});

// app.get("/header", (req, res) => {
//   res.render("head");
// });
// app.get("/dash", (req, res) => {
//   if (req.cookies.cookie) {
//     res.render("dash");
//   } else {
//     res.redirect("/");
//   }
// });
// app.get("/sign", (req, res) => {
//   res.render("signup");
// });

// app.post("/sign",async(req, res) => {
//   console.log(req.body);
//   res.cookie("cookie", req.body.username);
// await user.create(req.body)
//   res.render("dash");
//   res.send("Welcome");
// });
// app.post("/data", (req, res) => {
//   console.log(req.body);
//   res.render("Profile", {
//     name: req.body.username,
//     password: req.body.password,
//   });
// });

app.get("/reg", (req, res) => {
  res.render("reg");
});
app.post("/profile", async (req, res) => {
  let userdetails = await user.create(req.body);
  // res.cookie("user",req.body.username,{maxAge:150000000})
  console.log(userdetails.id);
  res.cookie("id", userdetails.id);

  res.redirect("/cart");
});

app.post("/cart", isAuth, async (req, res) => {
  let id = req.user.id || null;
  let data = await user.findById(id);
  data.cart.push({
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  await user.findByIdAndUpdate(id, data);
  console.log(data.cart);
  res.send(data.cart);
});
app.get("/data", (req, res) => {
  res.send(req.user);
});
app.get("/cart", isAuth, (req, response) => {
  response.render("cart");
});

app.get("/login", (req, res) => {
  console.log(req.session);

  res.render("login");
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  }),

  async (req, res) => {
    let data = req.body;
    // if(await user.find({username:user.username}))
    let details = await user.find({ username: data.username });

    res.send("done");
  }
);

app.get("/page", (req, res) => {
  console.log(req.session);
  console.log(day);
  if (req.session.visit) {
    req.session.visit++;
    res.send(`welcome to the server ${req.session.visit}`);
  } else {
    req.session.visit = 1;
    res.send(`welcome to the server`);
  }
});

app.get("/prof", (req, res) => {
  res.render("profile");
});

app.get("/admin", async (req, res) => {
  let data = await user.find();
  res.send(data);
});
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.send("loged out");
});




// google route 
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile',"email"] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.send("done")
  });





app.listen(8080, () => {
  console.log("Server is running on port 8080");
  connect();
});
