'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class listing_customeField_data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Listing, {
        foreignKey: "listingId",
        onDelete: "CASCADE",
      });
    }
  }
  listing_customeField_data.init(
    {
      listingId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      custome_data: DataTypes.ARRAY(DataTypes.JSONB),
    },
    {
      sequelize,
      modelName: "listing_customeField_data",
    }
  );
  return listing_customeField_data;
};