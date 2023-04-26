require("dotenv").config();
const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const localStrategy = require("passport-local").Strategy;
const userCollection = require("../model/Usuario");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      if (!req.body.name) return done("Nombre de usuario requerido");
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.match(emailRegex))
          return done(new Error("Proporciona un email correcto"), null);
        const user = await userCollection.create({
          email,
          password,
          name: req.body.name,
        });
        return done(null, user);
      } catch (error) {
        //Duplicado
        if (error.code === 11000) {
          done("Ese correo ya esta registrado");
        } else {
          console.log(error);
          done("Error de servidor");
        }
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      try {
        const user = await userCollection.findOne({ email });
        if (!user)
          return done(null, null, {
            message: "Usuario o contraseña incorrecta",
          });

        if (!user.validatePassword(password)) {
          return done(null, null, {
            message: "Usuario o contraseña incorrecta",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        const user = await userCollection.findOne({ _id: token.user._id });
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
