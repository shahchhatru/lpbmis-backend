const express = require('express');
const router = express.Router();
const mustBe = require('mustbe').routeHelpers();
const UserController = require('../controllers/users.controller');

router.post("/users",mustBe.authorized('admin'), UserController.createUser);
router.post("/users/:userId/changePassword", UserController.changePassword);
router.post("/users/:userId/resetPassword", UserController.resetPassword);

router.post("/login", UserController.login);

module.exports = router;

