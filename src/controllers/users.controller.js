const sequelize = require('sequelize');
const OP = sequelize.Op;

const models = require('../models/index');

const { sendUserCreatedEmail, sendOtpEmail } = require('../services/utils/mailer');
const passwordHash = require('../services/utils/passwordHash');
const crypto = require('crypto-js');
const JwtUtil = require('../services/utils/jwt.util');


async function createUser(req, res, next) {
    try {
      const municipalityId = req.user.municipality && req.user.municipality.id;
      const code = req.user.municipality && req.user.municipality.code;
      const data = req.body;
      if (data.confirm_password) {
        delete data.confirm_password;
      }
      const randomPassword = Math.random().toString(36).slice(-8);
      console.log(randomPassword);
      const hashedPassword = await passwordHash.saltHashPassword(randomPassword);
      console.log(hashedPassword);
      const params = {
        ...req.body,
        password: hashedPassword,
        municipality_id: municipalityId,
      };
      let user = await models.users.create(params);
      const baseURL = `https://${code}.frontend.chhatrabikramshah.com.np`;
      sendUserCreatedEmail(req.body.email, req.body.first_name, randomPassword, baseURL);
  
      res.send({
        data: { user },
        message: 'User Created Successfully',
        success: true,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async function changePassword(req, res, next) {
    try {
      const data = req.body;
      const id = req.params.userId;
  
      let hashPassword = await PasswordHashOperation.saltHashPassword(data.current_password);
      const user = await models.users.findOne({ password: hashPassword, id });
  
      if (!user) throw new Error(`Current password is wrong`);
  
      let newPassword = await PasswordHashOperation.saltHashPassword(data.password);
  
      await models.users.update({ id }, { password: newPassword });
  
      res.send({
        data: {},
        success: true,
        message: 'Password updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }

  async function resetPassword(req, res, next) {
    try {
      const id = req.params.userId;
      const code = req.user.municipality && req.user.municipality.code;
      const randomPassword = Math.random().toString(36).slice(-8);
      let hashedPassword = await passwordHash.saltHashPassword(randomPassword);
      const user = await UserService.findOneUser({ id });
  
      if (!user) throw new Error(`User not found`);
  
      await models.users.update({ id }, { password: hashedPassword });
      const baseURL = `https://${code}.lpbmis.gov.np`;
      sendUserCreatedEmail(
        user.email,
        `${user.first_name} ${user.last_name}`,
        randomPassword,
        baseURL,
        true
      );
  
      res.send({
        data: {},
        success: true,
        message: 'Password reset successful',
      });
    } catch (err) {
      next(err);
    }
  }

//login
async function login(req, res, next) {
  try {
    console.log(req.body);
    let { data, municipality_code } = req.body;
    console.log(data, municipality_code);

    const bytes = crypto.AES.decrypt(data, process.env.CIPHER_SECRET || 'random');
    console.log('Decrypted bytes:', bytes.toString(crypto.enc.Utf8));
    const decryptedData = JSON.parse(bytes.toString(crypto.enc.Utf8));

    console.log("decrypted data", decryptedData);

    // const { error } = Joi.validate(decryptedData, LoginSchema.schema);

    // if (error) {
    //   let errArray = [];
    //   error.details.forEach((err) => {
    //     errArray.push(err.message);
    //     throw new Error(errArray);
    //   });
    // }

    let hashPassword = await passwordHash.saltHashPassword(decryptedData.password);
    let include = [
      {
        model: models.wards,
        attributes: ['id', 'name', 'code'],
      },
    ];

    if (!municipality_code) {
      include.push({
        model: models.municipalities,
        attributes: ['id', 'name', 'config', 'code'],
      });
    }

    let params = {
      [OP.or]: [
        {
          username: decryptedData.username.trim(),
        },
        {
          email: decryptedData.username.trim(),
        },
      ],
      password: hashPassword,
      status: 'active',
      [OP.not]: [{ is_deleted: true }],
    };

    let userFound = await models.users.findOne(params, include);
    if (!userFound) {
      throw new Error('Mismatch email/username and password.');
    }
    let updateUserParams = {
      last_login_at: new Date(),
    };
    console.log("code", municipality_code);
    if (municipality_code) {
      if (userFound.role !== 'superUser') {
        throw new Error('Unable to access login for now');
      }
      const municipality = await models.municipalities.findOne({
        code: municipality_code,
      });
      userFound.municipality = municipality;
      updateUserParams.municipality_id = municipality.id;
    }

    await models.users.update(updateUserParams, {
      where: { id: userFound.id }
    });
    let token = await JwtUtil.encode(userFound);

    res.send({
      data: {
        token: `Bearer ${token}`,
      },
      message: 'Successfully login',
      success: true,
    });
  } catch (err) {
    next(err);
  }
}



module.exports = {
    createUser,
    changePassword,
    resetPassword,
    login
}