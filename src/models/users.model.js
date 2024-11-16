module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define(
      'users',
      {
        ward_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        municipality_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: 'Username must be unique.',
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive'),
          defaultValue: 'active',
          allowNull: false,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        middle_name: {
          type: DataTypes.STRING,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: {
            args: true,
            msg: 'Email must be unique.',
          },
        },
        role: {
          type: DataTypes.ENUM(
            'superUser',
            'admin',
            'projectApprover',
            'projectEntry',
            'projectViewer'
          ),
          allowNull: false,
        },
        last_login_at: {
          type: DataTypes.DATE,
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
          field: 'updated_at',
        },
        otp: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        otp_time: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        picture: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        is_deleted: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          set(value) {
            this.setDataValue('is_deleted', value);
            const newValue = `${this.getDataValue('email')}= .deleted.com' ${Date.now()}`;
            if (value) {
              this.setDataValue('email', newValue);
            }
          },
        },
      },
      {
        getterMethods: {
          roles() {
            return this.role === 'projectEntry'
              ? 'Data Entry'
              : this.role === 'projectApprover'
              ? `Data Approver`
              : this.role === `admin`
              ? `Admin`
              : this.role === 'projectViewer'
              ? 'Data Viewer'
              : 'Admin';
          },
          name() {
            return `${this.first_name} ${this.last_name}`;
          },
        },
        // timestamps: false
      }
    );
  
    User.associate = (models) => {
      User.belongsTo(models.wards, {
        foreignKey: 'ward_id',
      });
  
      User.belongsTo(models.municipalities, {
        foreignKey: 'municipality_id',
      });
    };
  
    User.prototype.canDeleteAble = function (params) {
      return this.sequelize.models.projects
        .findAll({
          attributes: ['id'],
          where: params,
        })
        .then((projects) => {
          if (projects.length > 0) return false;
          return true;
        });
    };
    return User;
  };
  