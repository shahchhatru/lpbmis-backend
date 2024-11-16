const express = require('express');
const router = express.Router();
const mustBe = require('mustbe').routeHelpers();

const WardController = require('../controllers/wards.controller');

router.post('/wards', mustBe.authorized('admin'), WardController.createWard);
router.get('/wards/:municipalityId', WardController.findAllWardsWithMunicipilityId);

module.exports = router;