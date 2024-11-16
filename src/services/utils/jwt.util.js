let jwt = require('jsonwebtoken');

const secretKey = process.env.CIPHER_SECRET || 'secret_npb_ims';

/**
 * Decode the jwt token
 * @param token{String}
 */
async function decode(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secretKey, function (err, payload) {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}

/**
 * Create a jwt token
 * @param user{Object}
 */
async function encode(user) {
  const payload = {
    id: user.id,
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    ward: user.ward,
    municipality: user.municipality,
    username: user.username,
    role: user.role,
    status: user.status,
    picture: user.picture,
  };
  return new Promise(function (resolve, reject) {
    jwt.sign(payload, secretKey, function (err, token) {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

module.exports = {
  decode,
  encode,
};
