const { DataTypes, Model } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

class Type extends Model {};

module.exports = (sequelize) => {
  // defino el modelo
  return Type.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    { sequelize, modelName: "Type" }
  );
};
