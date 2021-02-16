const { body } = require('express-validator');

var validate =  [// username must be an email
    body('email').not().isEmpty().isEmail(),
    // password must be at least 5 chars long
    body('password').not().isEmpty().isLength({ min: 5 }),
]

var validateChange =  [// username must be an email
       // password must be at least 5 chars long
    body('oldpw').not().isEmpty().isLength({ min: 5 }),
    body('newpw').not().isEmpty().isLength({ min: 5 }),
    body('rnewpw').not().isEmpty().isLength({ min: 5 }),
]


module.exports = {validate , validateChange} ;
