// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../users/users-model");
const {checkUsernameFree, checkUsernameExists, checkPasswordLength} = require("./auth-middleware");


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/register', checkPasswordLength, checkUsernameFree, async (req, res, next) => {
    const { username, password } = req.body
    //Use bcrypt.hashSync() to compare the password to the hash
    //Pass in the password and the salt
    const hash = bcrypt.hashSync(password, 8); // 2 ^ 8
    User.add({username, password: hash})
        .then(saved => {res.status(201).json(saved)})
        .catch(next)
})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/login', checkUsernameExists, async (req, res, next) => {
    const { password } = req.body;
    if ( bcrypt.compareSync(password, req.user.password)) {
      // cookie set to client //server stores a session with session id
      req.session.user = req.user;
      res.json({message: `welcome back, ${req.body.username}`})
    }
    else { next({ status: 401, message: 'invalid credentials!' }) }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.get('/logout', (req, res ) => {
  // if (req.session.user) {
  //   req.session.destroy(err => {
  //     if (err) {
  //       res.json({
  //         message: 'err, you cannot leave'
  //       })
  //     } else {
  //       res.json({
  //         message: 'bye!'
  //       })
  //     }
  //   })
  // } else {
  //   res.json({
  //     message: 'you were not logged in to begin with'
  //   })
  // }
  res.json("logout")
})
 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;