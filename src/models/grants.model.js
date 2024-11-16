const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  let Project = sequelize.define(
    'grant_projects',
    {
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      verifier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      approver_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ward_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      municipality_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      project_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      project_name_nepali: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      budget: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      population_Benefits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      project_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'pending'
      },
      project_details: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW'),
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: sequelize.fn('NOW'),
      },
      isSubmitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      getterMethods: {
        projectUpdatedDate() {
          return moment(this.updated_at).format('MMM DD, YYYY');
        },
      },
      timestamps: false,
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.municipalities, {
      foreignKey: 'municipality_id',
    });
    Project.belongsTo(models.wards, {
      foreignKey: 'ward_id',
    });
    Project.belongsTo(models.users, {
      as: 'creator',
      foreignKey: 'creator_id',
    });

    Project.belongsTo(models.users, {
      as: 'approver',
      foreignKey: 'approver_id',
    });

    Project.belongsTo(models.users, {
      as: 'verifier',
      foreignKey: 'verifier_id',
    });
  };
  return Project;
};
