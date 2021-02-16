const { Router } = require('express');
const authController = require('../controllers/authControllers');
const {validate , validateChange } = require('../validation/validation');
const {isLoggedin} = require('../middleware/middleware');

const router = Router();

router.post('/signup' , validate , authController.signup_post);

router.post('/login' ,validate, authController.login_post);

router.post('/changepw' , validateChange , isLoggedin , authController.changepw); 

router.get('/verification' ,authController.verification_get);

router.post('/forgotpw' ,validate , authController.forgotpw_post);

router.post('/forgotpw2' ,validate ,validateChange , authController.forgotpw_post2);

module.exports = router;