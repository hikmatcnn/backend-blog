//Lib
const express = require('express');
const router = express.Router();
const refController = require('../controllers/Ref.controller');
const kcdLevelController = require('../controllers/KCDLevel.controller');
const dinasLevelController = require('../controllers/DinasLevel.controller');
const authController = require('../controllers/Auth.controller');
const SSOController = require('../controllers/SSO.controller');
const UmumController = require('../controllers/Umum.controller');
const { checkAuthAdmin, checkAuth, checkAuthSSO } = require('../middlewares/Auth.middleware');
const { checkRoles } = require('../middlewares/Roles.middleware');
const { validate, verify, checkFileAndSize, closeRoute } = require('../middlewares/Validator.middleware');
const { checkLevels } = require('../middlewares/Levels.middleware');

//Ref
/**
  * @swagger
  * /:
  *   get:
  *     description: Returns the homepage
  *     responses:
  *       200:
  *         description: hello world
  * definitions:
  *     Auth:
  *         type: "object"
  *         properties:
  *             token:
  *                 type: "string"
  *         xml:
  *             name: "Auth"
  */
router.post('/auth_service/auth', validate("check_auth"), verify, authController.login);
router.delete('/auth_service/auth/logout', checkAuth, authController.logout);

router.post('/sso/access', SSOController.loginSSO);
router.post('/sso/autologin', SSOController.autoLogin);

router.use('/auth_service/v1/sso/app', checkAuthSSO);
router.get('/auth_service/v1/sso/app/validate', (req, res) => { res.send({ message: 'success' }) });
router.post('/auth_service/v1/sso/app/auto-login', SSOController.ssoAPPValidate);
router.post('/auth_service/v1/sso/app/logout', authController.logout);

//User
router.use('/auth_service/user', checkAuth);
router.get('/auth_service/user', authController.getUser);
router.put('/auth_service/user/settings/update-password', validate("check_update"), verify, authController.updatePassword);
router.get('/aaa', authController.generateUserAccount);

router.use('/ref', checkAuth);
router.get('/ref/jenis-file', refController.getJenisFile);
router.get('/ref/address/province', refController.getAddressProvince);
router.get('/ref/address/city', validate("get_address_city"), verify, refController.getAddressCity);
router.get('/ref/address/district', validate("get_address_city"), verify, refController.getAddressDistrict);
router.get('/ref/address/subdistrict', validate("get_address_city"), verify, refController.getAddressSubdistrict);

//App
router.use('/disaster', checkAuth);
router.get('/disaster', kcdLevelController.getListSchool);
router.get('/disaster/must-verified', kcdLevelController.getListSchoolNotVerified);
router.post('/disaster', checkFileAndSize, validate("create_school_damaged"), verify, kcdLevelController.createSchoolDamaged);
router.get('/disaster/:idDisaster', validate("get_detail_disaster"), verify, kcdLevelController.getDetailRegistrations);
router.put('/disaster', checkFileAndSize, validate("update_school_damaged"), verify, kcdLevelController.updateSchoolDamaged);
router.put('/disaster/must-verified', validate("update_school_verified"), verify, kcdLevelController.updateSchoolStatusVerified);
router.delete('/disaster/:idDisaster', validate("get_detail_disaster"), verify, kcdLevelController.deleteSchoolDamaged);
router.post('/disaster/upload', checkFileAndSize, validate("upload_file_school"), verify, kcdLevelController.uploadFileSchoolDamaged);

//Dashboard
router.use('/dashboard', checkAuth);
router.get('/dashboard', kcdLevelController.getDashboard);
router.get('/dashboard/per-school', kcdLevelController.getDashboardSchool);

router.use('/dinas', checkAuthAdmin);
router.get('/dinas/dashboard', dinasLevelController.getDashboard);
router.get('/dinas/dashboard/per-school', dinasLevelController.getDashboardSchool);
// router.get('/dinas/dashboard/chart-pie', dinasLevelController.getChartDataPie);
router.get('/dinas/disaster', dinasLevelController.getListSchool);
router.get('/dinas/disaster/:idDisaster', validate("get_detail_disaster"), verify, dinasLevelController.getDetailRegistrations);
router.get('/dinas/generate-account', dinasLevelController.generateUserAccount);
router.get('/file/download/:idFile', validate("download_file"), verify, kcdLevelController.downloadFile);

//testing
router.get('/umum/product', UmumController.getUmumProduct);
router.get('/umum/koneksiDB', UmumController.getUmumCekDB);

//exports
module.exports = router;