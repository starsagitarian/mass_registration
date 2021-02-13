const router = require('express').Router();
const controller = require('../controller/index');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin')

// ============== details post/create ================== //

router.post('/register', controller.register);

router.post('/activation', controller.activateEmail);

router.post('/login', controller.login);

router.post('/refresh_token', controller.getAccessToken);

router.post('/forgot', controller.forgotPassword);

router.post('/reset', auth, controller.resetPassword);

// ============== details get/Read ================== //

router.get('/infor', auth, controller.getUserInfor);

router.get('/all_infor', auth, authAdmin, controller.getUsersAllInfor);

router.get('/logout', controller.logout);

// ============== details put/patch/update ================== //

router.patch('/update', auth, controller.updateUser);

router.patch('/update_role/:id', auth, authAdmin, controller.updateUsersRole);

// ============== details delete ================== //

router.delete('/delete/:id', auth, authAdmin, controller.deleteUser);

// ============== social media login ================== //

router.post('/google_login', controller.googleLogin)

router.post('/facebook_login', controller.facebookLogin)

module.exports = router;