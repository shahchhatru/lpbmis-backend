const express = require('express');
const router = express.Router();
const mustBe = require('mustbe').routeHelpers();

const MunicipalityController = require('../controllers/municipalities.controller');

router.post('/municipality',mustBe.authorized('projectVerifier'), MunicipalityController.createMunicipality);
router.get('/municipalities', MunicipalityController.getMunicipality);

module.exports = router;
