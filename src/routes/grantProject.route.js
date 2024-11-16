const express = require('express');
const router = express.Router();
const mustBe = require('mustbe').routeHelpers();

const GrantProjectController = require('../controllers/grantProject.controller');

router.post('grantProjects', mustBe.authorized('projectEntry'), GrantProjectController.createProject);
router.get('grantProjects', mustBe.authorized('projectApprover'), GrantProjectController.getProject);
router.get('grantProject', mustBe.authorized('projectEntry'), GrantProjectController.getProjectByWard);
router.get('grantProjects/:projectId', mustBe.authorized('projectEntry'), GrantProjectController.getProjectById);

module.exports = router