const { DataTypes, Model } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

class Pokemon extends Model {}

module.exports = (sequelize) => {
  // defino el modelo
  // sequelize.define("pokemon", {
  //   name: {
  //     type: DataTypes.STRING,
  //     allowNull: false,
  //   },
  // });
  return Pokemon.init(
    {
      id: {
        type: DataTypes.UUID,//estos son id que pueden tener letras
        defaultValue:DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
      },
      vida: {
        type: DataTypes.INTEGER,
      },
      ataque: {
        type: DataTypes.INTEGER,
      },
      defensa: {
        type: DataTypes.INTEGER,
      },
      velocidad: {
        type: DataTypes.INTEGER,
      },
      altura: {
        type: DataTypes.INTEGER,
      },
      peso: {
        type: DataTypes.INTEGER,
      },
    },
    { sequelize, modelName: "Pokemon" }
  );
};
