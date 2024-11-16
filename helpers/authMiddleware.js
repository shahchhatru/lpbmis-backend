const CustomError = require('./customError');

const JwtUtil = require('../src/services/utils/jwt.util');

const checkExpiryTime = require('./checkExpiryTime');

const whiteListedUrl = ['/login', '/socket.io'];

const models = require('../src/models/index');

async function authorize(req, res, next) {
  const authorization = req.headers.authorization;
  if (whiteListedUrl.indexOf(req.url) > -1) {
    next();
  } else if (!authorization) {
    next(new CustomError.Unauthorized());
  } else {
    const decodedValue = req.headers.authorization.split(/(?:%20| )+/);
    await JwtUtil.decode(decodedValue[1])
      .then(async (decodedData) => {
        let include = [
          {
            model: models.wards,
            attributes: ['name', 'code'],
          },
          {
            model: models.municipalities,
            attributes: ['name', 'code', 'config', 'id'],
          },
        ];

        let user = await models.users.findOne( {where: { username: decodedData.username }, include: include});
        if (!user) throw new Error('Unauthorized');
        req.user = user;
        req.user.isMunicipalityUser = user.ward.code === '*';
        let { id } = req.user;
        await checkExpiryTime({ id });
        next();
        return null;
      })
      .catch((err) => {
        console.log(err, '--error---');
        next(new CustomError.Unauthorized());
      });
  }
}

module.exports = authorize;
