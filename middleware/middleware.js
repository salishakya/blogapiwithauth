const jwt = require('jsonwebtoken');

function checkLogin (req, res, next) {
jwt.verify(req.token , process.env.JWTsecret  , async (err , result) => {
    if (err) {
      res.sendStatus(403);
      console.log('not verified');
    } else {
        next();
    }
})
}

module.exports = checkLogin;