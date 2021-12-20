const User = require("../users/users-model");

/*
  If the user does not have a session saved in the server status 401
*/
function restricted(req, res, next) {
    if(req.session.user) {next()}
    else{next({status: 401, message: "you shall not pass!"})}
}

/*
  If the username in req.body already exists in the database status 422
 */
async function checkUsernameFree(req, res, next) {
    try{
        const users = await User.findBy({username: req.body.username})
        //If the user array is empty (has no length), the name is available, move on
        if(!users.length) {next()}
        //If the name is taken...
        else{next({status:422, message: "Username taken"})}
    }
    catch(err){next(err)}
}

/*
  If the username in req.body does NOT exist in the database status 401
*/
async function checkUsernameExists(req, res, next) {
    try{
        const users = await User.findBy({username: req.body.username})
        //If the user exists (the array has length), proceed
        if(users.length) {
            req.user = users[0]
            next()
        }
        //Otherwise...
        else{next({status:401, message: "Invalid credentials"})}
    }
    catch(err){next(err)}
}


/*
  If password is missing from req.body, or if it's 3 chars or shorter status 422
*/
function checkPasswordLength(req, res, next) {
    if(!req.body.password || req.body.password.length < 3){
        next({message: "Password must be longer than 3 chars", status: 422})
    }
    else{next()}
}

module.exports = {restricted, checkUsernameFree, checkUsernameExists, checkPasswordLength }

