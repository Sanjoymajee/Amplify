const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const bcrypt = require('bcrypt')
const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET
const passport = require('passport')
const User = require('../models/user.model')

// Set up the local strategy for username and password authentication
passport.use(
  'login',
  new LocalStrategy(async (username, password, done) => {
    try {
      const email = req.body.email
      const user = await User.findOne({ email })
      // console.log(user)
      if (!user || !user.password) {
        return done(null, false, { message: 'Incorrect username or password' })
      }
      const passwordMatch = await user.comparePassword(password)
      // console.log(passwordMatch)
      if (!passwordMatch) {
        return done(null, false)
      }
      return done(null, user)
    } catch (err) {
      return done(err)
    }
  })
)

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async function (req, username, password, done) {
      try {
        // Check if user with given email already exists
        const email = req.body.email
        const user = await User.findOne({email})

        // If user with given username already exists, return an error message
        if (user) {
          if (user.email === email) {
            return done(null, false, { message: 'Username already exists' })
          } else {
            return done(null, false, { message: 'Email already exists' })
          }
        }

        // Create a new user with given username, email, and password
        const newUser = await User.create({
          email,
          username,
          password,
        })

        return done(null, newUser)
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      const email = profile.emails[0].value
      const user = await User.findOneAndUpdate(
        { googleId: profile.id }, // Search query
        {
          $setOnInsert: {
            // Update or insert if not exists
            displayName: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            username: email.split('.')[0] // making username the part before the @ in the email
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true } // Options to return the new document if it doesn't exist
      )
      return done(null, user)
    }
  )
)

// Serialize and deserialize user object
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})
