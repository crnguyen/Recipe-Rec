'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favoriteRecipes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.favoriteRecipes.belongsTo(models.user)
    }
  };
  favoriteRecipes.init({
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    recipeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'favoriteRecipes',
  });
  return favoriteRecipes;
};