module.exports = (sequelize, DataTypes) => {
    let Ward = sequelize.define(
      'wards',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        municipality_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        mutable: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      {
        timestamps: false,
      }
    );
  
    Ward.associate = (models) => {
      Ward.hasMany(models.users, {
        foreignKey: 'ward_id',
        sourceKey: 'id',
      });
  
      Ward.belongsTo(models.municipalities, {
        foreignKey: 'municipality_id',
      });
    };
  
    Ward.prototype.canDeleteAble = function (params) {
      return this.sequelize.models.users
        .findAll({
          attributes: ['id'],
          where: params,
        })
        .then((users) => {
          if (users.length > 0) return false;
          return true;
        });
    };
  
    return Ward;
  };
  