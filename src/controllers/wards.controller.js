const sequelize = require('sequelize');
const Op = sequelize.Op;

const models = require('../models/index');

async function createWard(req, res, next) {
    try {
        let wardData = req.body;
        wardData.name = wardData.name.trim();
        wardData.code = wardData.name.trim();
        wardData.mutable = true;
        const municipalityId = req.user.municipality && req.user.municipality.id;
        wardData.municipality_id = municipalityId;
        let m = await models.wards.findOne(wardData);
        if (m) {
          throw new Error('Ward already exist.');
        }
        let ward = await models.Ward.create(wardData);
        res.send({
          data: { ward },
          message: 'Ward Created Successfully',
          success: true,
        });
      } catch (err) {
        console.log('err', err.message);
        next(err);
      }
}

async function getWard(req, res, next) {
    try {
      let id = req.params.municipalityId;
      let params = { id };
  
      let ward = await models.wards.findOne(params);
      res.send({
        data: { ward },
        message: '',
        success: true,
      });
    } catch (err) {
      next(err);
    }
  }


  async function findAllWardsWithMunicipilityId(req, res, next) {
    try {
      const municipalityId = req.params.municipalityId;
      
      const wards = await models.wards.findAll({where: { municipality_id: municipalityId }});
      res.send({
        data: { wards },
        message: '',
        success: true,
      });
  
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    createWard,
    getWard,
    findAllWardsWithMunicipilityId
}
