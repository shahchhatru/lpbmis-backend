const moment = require('moment');

const models = require('../src/models/index');

const CustomError = require('./customError');

const JwtUtil = require('../src/services/utils/jwt.util');

async function checkExpiryToken(params) {
  await io.sockets.once('connection', function (socket) {
    socket.on('join', async function (data) {
      let include = [
        {
          model: models.ministries,
          attributes: ['id', 'name'],
        },
        {
          model: models.departments,
          attributes: ['id', 'name', 'ministry_id'],
        },
      ];

      let user = await models.users.findOne({where: { id: data.id }, include:include});
      if (!user) throw new CustomError.Unauthorized();

      let lastLoginAt = moment(user.last_login_at);
      let lastUpdatedAt = moment(user.updatedAt);

      if (!lastLoginAt) throw new CustomError.Unauthorized();

      if (lastLoginAt < lastUpdatedAt) {
        console.log(`token expired`, data.id);

        socket.join(data.id);

        let token = await JwtUtil.encode(user);

        await io.sockets.in(data.id).emit('token', {
          token: `Bearer ${token}`,
        });

        await models.users.update({ last_login_at: new Date() }, {where: { id: data.id }});

        socket.leave(data.id, function () {
          console.log('Leave room', data.id);
          return true;
        });

        return true;
      }
      // console.log(`everything ok`);
      return true;
    });

    // socket.on('disjoin', function(user){
    //   console.log('inside disjoin', user)
    //   console.log('user ' + user.id + ' disconnected');
    //   // remove saved socket from users object
    //   socket.leave(user.id, function () {
    //     console.log('Leave room',user.id)
    //   });

    // });
  });
}

module.exports = checkExpiryToken;
