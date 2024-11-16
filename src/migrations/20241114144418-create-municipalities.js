module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('municipalities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
      config: {
        allowNull: false,
        type: Sequelize.JSON,
        // defaultValue: '{}',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('municipalities');
  },
};
