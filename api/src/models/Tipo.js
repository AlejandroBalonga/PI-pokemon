const { DataTypes, Model } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

class Tipo extends Model {};

module.exports = (sequelize) => {
  // defino el modelo
  return Tipo.init(
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
    { sequelize, modelName: "Tipo" }
  );
};
