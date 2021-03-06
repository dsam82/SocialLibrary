'use strict';
module.exports = (sequelize, DataTypes) => {
  const request = sequelize.define('request', {
    status: {
        type: DataTypes.ENUM('onhold', 'accept','reject'),
        defaultValue: 'onhold'
    },
    bstatus: {
        type: DataTypes.ENUM('onhold', 'received', 'returned'),
        defaultValue: 'onhold'
    },
    accepted: {
        type: DataTypes.DATE,
        allowNull: true
    },
    returndate: {
        type: DataTypes.DATE,
        allowNull: true
    },
  });
  request.associate = function(models) {
    // associations can be defined here
    request.belongsTo(models.owned, {
        foreignKey: 'bookId',
        onDelete: 'CASCADE',
    });
    request.belongsTo(models.user, {
        foreignKey: 'borrowerId',
    });
  };
  return request;
};