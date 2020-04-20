module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('delivery_problems', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        references: { model: 'deliveries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      uniqueKeys: {
        delivery_problunique: {
          customIndex: true,
          fields: ['delivery_id', 'created_at'],
        },
      },
    }
    );
  },

  down: queryInterface => {
    return queryInterface.dropTable('delivery_problems');
  },
};
