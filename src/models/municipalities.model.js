module.exports = (sequelize, DataTypes) => {
    let Municipality = sequelize.define(
      'municipalities',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        code: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        config: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    );
  
    Municipality.associate = (models) => {
      Municipality.hasMany(models.users, {
        foreignKey: 'municipality_id',
        sourceKey: 'id',
      });;
    };
  
    Municipality.prototype.canDeleteAble = function (params) {
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
  
    return Municipality;
  };
  