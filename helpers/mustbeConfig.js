const helpers = require('./mustBe/helper');

module.exports = function (config) {
  config.routeHelpers(function (rh) {
    rh.getUser(helpers.user);

    rh.notAuthorized(function (req, res, next) {
      res.redirect(process.env.APP_URL);
    });

    rh.notAuthenticated(function (req, res, next) {
      res.status(401).send({
        message: 'Not authenticated',
      });
    });

    config.activities(function (activities) {
      activities.can('projectEntry', helpers.activities.projectEntry.is);
    });
    config.activities(function (activities) {
      activities.can('projectApprover', helpers.activities.projectApprover.is);
    });

    config.activities(function (activities) {
      activities.can('projectVerifier', helpers.activities.projectVerifier.is);
    });
    config.activities(function (activities) {
      activities.can('superUser', helpers.activities.superUser.is);
    });
    config.activities(function (activities) {
      activities.can('projectViewer', helpers.activities.projectViewer.is);
    });
    config.activities(function (activities) {
      activities.can('admin', helpers.activities.admin.is);
    });
  });
  
};
