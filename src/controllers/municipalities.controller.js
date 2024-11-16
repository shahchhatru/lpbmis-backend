const sequelize = require('sequelize');
const Op = sequelize.Op;

const models = require('../models/index');

const Municipality = require('../models/municipalities.model');

async function fetchedMunicipality(params) {
    return await models.municipalities.findOne({name: params})
}

async function createMunicipality(req, res,next) {
    try {
        let municiPalityData = req.body;
        console.log(municiPalityData);
        municiPalityData.name = municiPalityData.name.trim();
        let m = await fetchedMunicipality(municiPalityData.name);
        if (m) {
          throw new Error('Municipality already exist.');
        }
    
        let municipality = await models.municipalities.create(municiPalityData);
        res.send({
          data: { municipality },
          message: 'Municipality Created Successfully',
          success: true,
        });
      } catch (err) {
        next(err);
      }
}

async function getMunicipality(req, res, next) {
    try {
        let id = req.params.municipalityId;
        let params = { id };
        if(params) {
            throw new Error("MunicipalityId not found");
        }
    
        let municipality = await models.municipalities.findOne({where:{id: params}});
        res.send({
          data: { municipality },
          message: '',
          success: true,
        });
      } catch (err) {
        next(err);
      }
}

module.exports = {
  createMunicipality, 
  getMunicipality
}